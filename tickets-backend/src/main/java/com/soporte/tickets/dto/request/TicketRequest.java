package com.soporte.tickets.dto.request;

import com.soporte.tickets.enums.Priority;
import com.soporte.tickets.enums.TicketStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TicketRequest {

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 150, message = "El título no puede superar 150 caracteres")
    private String titulo;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    @NotNull(message = "La prioridad es obligatoria")
    private Priority prioridad;

    private TicketStatus status;
    private Long categoriaId;
    private Long asignadoAId;
    private String closedAt;
}
