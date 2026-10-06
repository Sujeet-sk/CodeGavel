package com.codegavel.judge;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class SubmissionQueue {

    private static final String QUEUE = "codegavel:submissions";

    private final StringRedisTemplate redisTemplate;

    public SubmissionQueue(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void enqueue(Long submissionId) {
        redisTemplate.opsForList().rightPush(QUEUE, submissionId.toString());
    }

    public String dequeue() {
        return redisTemplate.opsForList().leftPop(QUEUE);
    }
}
