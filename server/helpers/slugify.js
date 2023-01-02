module.exports = slugify;

// Convierte cadena en slug
function slugify(input) {
    if (!input)
        return;

    // Haga minusculas y sin espacios
    var slug = input.toLowerCase().trim();

    // Remplase caracteres invalidos con espacios
    slug = slug.replace(/[^a-z0-9\s-]/g, ' ');

    // Remplace multiples espacios o hyphers(guiones) con un simple hyphen(guion)
    slug = slug.replace(/[\s-]+/g, '-');

    return slug;
}