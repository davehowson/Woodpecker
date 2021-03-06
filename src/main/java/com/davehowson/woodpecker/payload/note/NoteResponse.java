package com.davehowson.woodpecker.payload.note;

import com.davehowson.woodpecker.payload.user.UserSummary;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class NoteResponse {
    private Long id;
    private String title;
    private String description;
    private String tag;
    private Boolean important;
    private UserSummary createdBy;
    private Instant creationDateTime;
}
