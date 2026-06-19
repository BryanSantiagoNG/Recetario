const recipeForm = document.getElementById('recipe-form');
const recipeList = document.getElementById('recipe-list');
const modal = document.getElementById('recipe-modal');
const modalBody = document.getElementById('modal-body');
const navbar = document.getElementById('navbar');

function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    navbar.classList.remove('active');
    window.scrollTo(0, 0);
}

function toggleMenu() {
    navbar.classList.toggle('active');
}

if (recipeForm) {
    recipeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const rawIngredients = document.getElementById('ingredients').value;
        const rawProcedure = document.getElementById('procedure').value;

        const ingredientsArr = rawIngredients.split(',')
            .map(s => s.trim())
            .filter(s => s !== "");

        const procedureArr = rawProcedure.split(',')
            .map(s => s.trim())
            .filter(s => s !== "");

        const newRecipe = {
            id: Date.now(), 
            title: document.getElementById('title').value,
            ingredients: ingredientsArr,
            procedure: procedureArr,
            image: document.getElementById('image').value || 'https://images.unsplash.com/photo-1495195129352-aec325a55b65?q=80&w=400'
        };

        saveToLocalStorage(newRecipe);
        
        recipeForm.reset();
        showSection('recetas');
        loadRecipes();
    });
}

function saveToLocalStorage(recipe) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
    recipes.push(recipe);
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
}

function loadRecipes() {
    if (!recipeList) return;
    let recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
    
    recipeList.innerHTML = '';

    if (recipes.length === 0) {
        recipeList.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 20px;">No tienes recetas guardadas. ¡Añade la primera!</p>`;
        return;
    }

    recipes.forEach(r => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.onclick = () => openRecipe(r.id);
        card.innerHTML = `
            <img src="${r.image}" alt="${r.title}" onerror="this.src='https://via.placeholder.com/400?text=Comida'">
            <h3>${r.title}</h3>
        `;
        recipeList.appendChild(card);
    });
}

function openRecipe(id) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
    const r = recipes.find(recipe => recipe.id === id);

    if (!r) return;

    modalBody.innerHTML = `
        <img src="${r.image}" style="width:100%; max-height:300px; object-fit:cover; border-radius:10px;">
        <h2 style="margin: 20px 0; color: var(--primary); font-size: 2rem;">${r.title}</h2>
        
        <div class="modal-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <div>
                <h4 style="border-bottom: 2px solid var(--primary); margin-bottom: 15px;">🛒 Ingredientes</h4>
                ${r.ingredients.map((ing, i) => `
                    <div class="check-item">
                        <input type="checkbox" id="ing-${id}-${i}">
                        <label for="ing-${id}-${i}">${ing}</label>
                    </div>
                `).join('')}
            </div>
            <div>
                <h4 style="border-bottom: 2px solid var(--primary); margin-bottom: 15px;">👨‍🍳 Preparación</h4>
                ${r.procedure.map((step, i) => `
                    <div class="check-item">
                        <input type="checkbox" id="step-${id}-${i}">
                        <label for="step-${id}-${i}"><strong>Paso ${i+1}:</strong> ${step}</label>
                    </div>
                `).join('')}
            </div>
        </div>

        <div style="margin-top: 30px; display: flex; flex-direction: column; gap: 10px;">
            <button class="btn-download" onclick="downloadSingleTXT(${r.id})" style="background: #27ae60; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">📄 Descargar Receta (Texto)</button>
            <button onclick="deleteRecipe(${r.id})" style="color: #e74c3c; border: none; background: none; cursor: pointer; font-size: 0.9rem;">🗑️ Eliminar receta permanentemente</button>
        </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; 
}

function closeRecipe() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto'; 
}

function deleteRecipe(id) {
    if (confirm("¿Estás seguro de que deseas eliminar esta receta?")) {
        let recipes = JSON.parse(localStorage.getItem('myRecipes'));
        recipes = recipes.filter(r => r.id !== id);
        localStorage.setItem('myRecipes', JSON.stringify(recipes));
        closeRecipe();
        loadRecipes();
    }
}

function exportAllRecipes() {
    const recipes = localStorage.getItem('myRecipes');
    if (!recipes || recipes === "[]") {
        alert("No hay recetas para exportar.");
        return;
    }

    const blob = new Blob([recipes], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Mis_Recetas_ChefDigital.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importRecipes(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedRecipes = JSON.parse(e.target.result);
            let currentRecipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
            
            const combinedRecipes = [...currentRecipes, ...importedRecipes];
            localStorage.setItem('myRecipes', JSON.stringify(combinedRecipes));
            
            alert("¡Recetas importadas con éxito!");
            loadRecipes();
        } catch (error) {
            alert("Error: El archivo no tiene un formato de receta válido.");
        }
    };
    reader.readAsText(file);
}

function downloadSingleTXT(id) {
    const recipes = JSON.parse(localStorage.getItem('myRecipes'));
    const r = recipes.find(recipe => recipe.id === id);
    
    let text = `RECETA: ${r.title.toUpperCase()}\n`;
    text += `\n--- INGREDIENTES ---\n${r.ingredients.map(i => '- ' + i).join('\n')}\n`;
    text += `\n--- PREPARACIÓN ---\n${r.procedure.map((p, i) => (i+1) + '. ' + p).join('\n')}\n`;
    text += `\nGenerado por ChefDigital`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${r.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeRecipe();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadRecipes();
});