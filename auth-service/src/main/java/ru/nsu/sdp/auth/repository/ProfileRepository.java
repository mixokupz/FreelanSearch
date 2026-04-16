package ru.nsu.sdp.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.nsu.sdp.auth.entity.Profile;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
}
