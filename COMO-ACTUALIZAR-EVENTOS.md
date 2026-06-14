# Como Actualizar os Próximos Eventos

Este guia explica como adicionar, editar ou remover eventos na secção **"Eventos e Celebrações"** do site.

## Localização no Código

Abra o ficheiro `index.html` e procure por:

```html
<!-- ===================== EVENTOS E CELEBRAÇÕES ===================== -->
```

Dentro desta secção, procure por:

```html
<!-- Próximos Eventos -->
```

## Adicionar um Novo Evento

1. **Copie** um bloco completo de evento existente (desde `<div class="proxev-card">` até ao `</div>` correspondente)

2. **Cole** abaixo do último evento

3. **Edite** os seguintes campos:

```html
<!-- Evento NOVO -->
<div class="proxev-card fade-in">
    <div class="proxev-date">
        <span class="proxev-day">25</span>          <!-- ← DIA -->
        <span class="proxev-month">Dez</span>       <!-- ← MÊS -->
        <span class="proxev-year">2026</span>       <!-- ← ANO -->
    </div>
    <div class="proxev-body">
        <!-- Tipo de evento: escolha entre as opções abaixo -->
        <span class="proxev-tag"><i class="fas fa-utensils"></i> Jantar de Natal</span>
        
        <h3>Nome do Evento</h3>                     <!-- ← TÍTULO -->
        <p>Descrição do evento aqui...</p>          <!-- ← DESCRIÇÃO -->
        
        <div class="proxev-info">
            <span><i class="fas fa-map-marker-alt"></i> Local do Evento</span>  <!-- ← LOCAL -->
            <span><i class="fas fa-clock"></i> Horário</span>                    <!-- ← HORA -->
        </div>
    </div>
</div>
```

## Tipos de Etiquetas (Tags)

Escolha o tipo de evento e cole a linha correspondente:

### Eventos Normais
```html
<span class="proxev-tag"><i class="fas fa-utensils"></i> Encontro de Família</span>
<span class="proxev-tag"><i class="fas fa-tree"></i> Piquenique Anual</span>
<span class="proxev-tag"><i class="fas fa-church"></i> Missa</span>
<span class="proxev-tag"><i class="fas fa-glass-cheers"></i> Jantar</span>
```

### Eventos Especiais (com destaque dourado)
```html
<span class="proxev-tag especial"><i class="fas fa-birthday-cake"></i> 47.º Aniversário</span>
<span class="proxev-tag especial"><i class="fas fa-star"></i> Evento Especial</span>
```

## Remover um Evento Passado

Quando um evento já passou:

1. **Encontre** o bloco do evento (começa com `<div class="proxev-card">`)
2. **Apague** desde `<div class="proxev-card">` até ao `</div>` correspondente
3. **Guarde** o ficheiro

## Exemplo Completo de Adição

```html
<!-- Copie este bloco e edite -->
<div class="proxev-card fade-in delay-2">
    <div class="proxev-date">
        <span class="proxev-day">31</span>
        <span class="proxev-month">Dez</span>
        <span class="proxev-year">2026</span>
    </div>
    <div class="proxev-body">
        <span class="proxev-tag"><i class="fas fa-glass-cheers"></i> Jantar de Ano Novo</span>
        <h3>Passagem de Ano 2027</h3>
        <p>Jantar de fim de ano com música ao vivo e brinde à meia-noite para celebrar a entrada em 2027.</p>
        <div class="proxev-info">
            <span><i class="fas fa-map-marker-alt"></i> Restaurante Sabores d'Avó</span>
            <span><i class="fas fa-clock"></i> 21h00</span>
        </div>
    </div>
</div>
```

## Dicas

- **Mantenha sempre 3 a 4 eventos visíveis** na página
- **Remova eventos passados** para manter a secção actualizada
- **Use o delay** (`delay-1`, `delay-2`, `delay-3`) nos cards para animações escalonadas
- **Guarde sempre** o ficheiro após editar
- **Refresque o browser** (F5) para ver as alterações

---

**Precisa de ajuda?** Contacte o administrador do site.
