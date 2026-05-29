package ru.nsu.sdp.profile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.nsu.sdp.profile.entity.Profile;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    Optional<Profile> findByUserId(Long userId);
}
