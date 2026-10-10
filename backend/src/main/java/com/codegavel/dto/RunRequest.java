package com.codegavel.dto;

import jakarta.validation.constraints.NotBlank;

public class RunRequest {

    @NotBlank
    private String sourceCode;

    public String getSourceCode() {
        return sourceCode;
    }

    public void setSourceCode(String sourceCode) {
        this.sourceCode = sourceCode;
    }
}
