import axios from 'axios';

/**
 * Genera una receta usando la API de Claude a través del backend
 * @param {string} input - Descripción o nombre del plato
 * @param {Object} parameters - Parámetros de configuración del plato
 * @returns {Promise<string>} - Receta generada en formato Markdown
 */
export const generateRecipeClaude = async (input, parameters) => {
    try {
        const {
            cuisineType,
            dishCategory,
            cookingTechnique,
            culinaryTags,
            ingredients
        } = parameters;

        const cuisine = Array.isArray(cuisineType) ? cuisineType.join(', ') : cuisineType;
        const category = Array.isArray(dishCategory) ? dishCategory.join(', ') : dishCategory;
        const technique = Array.isArray(cookingTechnique) ? cookingTechnique.join(', ') : cookingTechnique;
        const tags = Array.isArray(culinaryTags) ? culinaryTags.join(', ') : culinaryTags;

        const prompt = `Crea una receta detallada pero fácil de seguir para el siguiente plato:

        **Descripción / Idea Principal:** "${input}"

        **Contexto Culinario del Plato Generado:**
        ${cuisine ? `- Tipo de Cocina: ${cuisine}` : ''}
        ${category ? `- Categoría: ${category}` : ''}
        ${technique ? `- Técnica de Cocción Principal: ${technique}` : ''}
        ${tags ? `- Características / Etiquetas: ${tags}` : ''}
        ${ingredients ? `- Ingredientes Clave Detectados/Usados: ${ingredients}` : ''}

        **Tu Tarea:**
        Actúa como un chef profesional y genera una receta que coincida exactamente con este perfil culinario. La receta debe ser breve, simple y deliciosa.

        **Formato Requerido (Markdown):**

        ### [Nombre Creativo y Apetitoso del Plato]

        **Descripción:**
        Una breve frase que describa el plato evocando los estilos culinarios mencionados.

        **Ingredientes:**
        - [Ingrediente 1 con cantidad]
        - [Ingrediente 2 con cantidad]
        ...

        **Instrucciones Paso a Paso:**
        1. [Paso 1]
        2. [Paso 2]
        ...

        **Consejo del Chef:**
        Un tip breve para mejorar la presentación o el sabor.

        Mantén el tono profesional, inspirador pero accesible.`;

        // Llamada al endpoint del backend que actúa como proxy para Claude
        const response = await axios.post('/api/generate-recipe-claude', {
            prompt: prompt
        });

        if (response.data && response.data.success) {
            return response.data.recipe;
        } else {
            throw new Error(response.data.error || 'Error desconocido al generar receta');
        }

    } catch (error) {
        console.error("Error generando receta con Claude:", error);
        return "No se pudo generar la receta con Claude. Verifica tu API Key o intenta más tarde.";
    }
};
