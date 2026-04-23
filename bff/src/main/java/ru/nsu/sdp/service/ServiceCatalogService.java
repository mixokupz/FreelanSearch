package ru.nsu.sdp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;
import ru.nsu.sdp.dto.ApiResponse;
import ru.nsu.sdp.dto.ListResponse;
import ru.nsu.sdp.dto.ServiceAdSource;
import ru.nsu.sdp.dto.ServiceAdView;
import ru.nsu.sdp.dto.UserProfile;

import java.util.Base64;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceCatalogService {

    private static final ParameterizedTypeReference<ApiResponse<ListResponse<ServiceAdSource>>> SERVICE_ADS_RESPONSE_TYPE =
            new ParameterizedTypeReference<>() {};

    @Qualifier("searchWebClient")
    private final WebClient searchWebClient;
    private final ProfileService profileService;
    private final MediaService mediaService;

    public ApiResponse<ListResponse<ServiceAdView>> getAnnouncements(
            String authorizationHeader,
            MultiValueMap<String, String> queryParams
    ) {
        WebClient.RequestHeadersSpec<?> request = searchWebClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder.path("/api/v1/search/services");
                    if (queryParams != null && !queryParams.isEmpty()) {
                        queryParams.forEach((key, values) -> {
                            if (values == null || values.isEmpty()) {
                                return;
                            }

                            for (String value : values) {
                                builder.queryParam(key, value);
                            }
                        });
                    }
                    return builder.build();
                });

        if (authorizationHeader != null && !authorizationHeader.isBlank()) {
            request = request.header(HttpHeaders.AUTHORIZATION, authorizationHeader);
        }

        ApiResponse<ListResponse<ServiceAdSource>> sourceResponse = request
                .retrieve()
                .bodyToMono(SERVICE_ADS_RESPONSE_TYPE)
                .block();

        ApiResponse<ListResponse<ServiceAdSource>> response =
                Objects.requireNonNull(sourceResponse, "Search service returned empty response body");
        ListResponse<ServiceAdSource> sourceData =
                Objects.requireNonNull(response.getData(), "Search service returned empty data");
        List<ServiceAdSource> sourceItems =
                Objects.requireNonNull(sourceData.getItems(), "Search service returned empty items");

        List<ServiceAdView> mergedItems = sourceItems.stream()
                .map(item -> mergeServiceAd(item, authorizationHeader))
                .collect(Collectors.toList());

        return new ApiResponse<>(response.getStatus(), new ListResponse<>(mergedItems));
    }

    private ServiceAdView mergeServiceAd(ServiceAdSource source, String authorizationHeader) {
        Integer authorId = resolveAuthorId(source);
        String mediaId = resolveMediaId(source);

        ApiResponse<UserProfile> authorResponse = profileService.getUserProfileById(authorId, authorizationHeader);
        UserProfile author = Objects.requireNonNull(authorResponse.getData(), "Profile service returned empty author data");

        ResponseEntity<byte[]> mediaResponse = mediaService.downloadImage(mediaId, authorizationHeader);
        byte[] mediaBytes = Objects.requireNonNull(mediaResponse.getBody(), "Media service returned empty image");
        MediaType mediaType = mediaResponse.getHeaders().getContentType();

        ServiceAdView.ImagePayload imagePayload = new ServiceAdView.ImagePayload();
        imagePayload.setMediaId(mediaId);
        imagePayload.setContentType(mediaType != null ? mediaType.toString() : null);
        imagePayload.setBase64(Base64.getEncoder().encodeToString(mediaBytes));

        ServiceAdView view = new ServiceAdView();
        view.setId(source.getId());
        view.setTitle(source.getTitle());
        view.setDescription(source.getDescription());
        view.setPrice(source.getPrice());
        view.setPriceType(source.getPriceType());
        view.setStatus(source.getStatus());
        view.setAuthor(author);
        view.setImage(imagePayload);
        return view;
    }

    private Integer resolveAuthorId(ServiceAdSource source) {
        if (source.getAuthorId() != null) {
            return source.getAuthorId();
        }
        throw new IllegalStateException("Service ad does not contain author id");
    }

    private String resolveMediaId(ServiceAdSource source) {
        if (source.getMediaId() != null && !source.getMediaId().isBlank()) {
            return source.getMediaId();
        }

        if (source.getPhotos() != null && !source.getPhotos().isEmpty()) {
            ServiceAdSource.ServicePhotoRef firstPhoto = source.getPhotos().get(0);
            if (firstPhoto.getMediaId() != null && !firstPhoto.getMediaId().isBlank()) {
                return firstPhoto.getMediaId();
            }
            if (firstPhoto.getId() != null) {
                return String.valueOf(firstPhoto.getId());
            }
        }

        throw new IllegalStateException("Service ad does not contain media id");
    }
}
