var bg_color = document.getElementById('bg_color');

bg_color.addEventListener("change", (event) => {
    document.body.style.backgroundColor = bg_color.value;
});

var text_color = document.getElementById('text_color');

text_color.addEventListener("change", (event) => {
    document.body.style.color = text_color.value;
});