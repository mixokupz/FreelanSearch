package ru.nsu.sdp.profile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.nsu.sdp.profile.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
