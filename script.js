const recipeForm = document.getElementById('recipe-form');
const recipeList = document.getElementById('recipe-list');
const modal = document.getElementById('recipe-modal');
const modalBody = document.getElementById('modal-body');

function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

if (recipeForm) {
    recipeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const ingredientsArray = document.getElementById('ingredients').value.split(',').map(i => i.trim()).filter(i => i !== "");
        const procedureArray = document.getElementById('procedure').value.split(',').map(p => p.trim()).filter(p => p !== "");

        const recipe = {
            id: Date.now(),
            title: document.getElementById('title').value,
            ingredients: ingredientsArray,
            procedure: procedureArray,
            image: document.getElementById('image').value || 'https://via.placeholder.com/400?text=Sin+Imagen'
        };

        let recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
        recipes.push(recipe);
        localStorage.setItem('myRecipes', JSON.stringify(recipes));
        
        recipeForm.reset();
        showSection('recetas');
        loadRecipes();
    });
}

function loadRecipes() {
    if (!recipeList) return;
    let recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
    recipeList.innerHTML = '';

    if (recipes.length === 0) {
        recipeList.innerHTML = '<p>No hay recetas. ¡Añade la primera!</p>';
        return;
    }

    recipes.forEach(r => {
        const div = document.createElement('div');
        div.className = 'recipe-card';
        div.onclick = () => openRecipe(r.id);
        div.innerHTML = `
            <img src="${r.image}" alt="${r.title}">
            <div style="padding:15px;">
                <h3 style="margin:0; color:#2c3e50;">${r.title}</h3>
                <p style="font-size: 0.8rem; color: #e67e22; font-weight:bold; margin-top:5px;">Ver detalles →</p>
            </div>
        `;
        recipeList.appendChild(div);
    });
}

function openRecipe(id) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
    const r = recipes.find(recipe => recipe.id === id);

    if (!r) return;

    const ingHTML = r.ingredients.map((ing, i) => `
        <div class="check-item">
            <input type="checkbox" id="ing-${i}">
            <label for="ing-${i}">${ing}</label>
        </div>
    `).join('');

    const stepHTML = r.procedure.map((step, i) => `
        <div class="check-item">
            <input type="checkbox" id="step-${i}">
            <label for="step-${i}"><strong>Paso ${i+1}:</strong> ${step}</label>
        </div>
    `).join('');

    modalBody.innerHTML = `
        <div style="text-align:center;">
            <img src="${r.image}" style="width:100%; max-height:300px; object-fit:cover; border-radius:10px;">
        </div>
        <h2 style="font-size:2.2rem; color:#2c3e50; margin: 20px 0;">${r.title}</h2>
        
        <div class="modal-grid">
            <div class="column">
                <h3 style="color:#e67e22; border-bottom:2px solid #e67e22; padding-bottom:5px;">🛒 Ingredientes</h3>
                <div style="margin-top:15px;">${ingHTML}</div>
            </div>
            <div class="column">
                <h3 style="color:#e67e22; border-bottom:2px solid #e67e22; padding-bottom:5px;">👨‍🍳 Preparación</h3>
                <div style="margin-top:15px;">${stepHTML}</div>
            </div>
        </div>
        
        <div style="margin-top:40px; border-top:1px solid #eee; padding-top:20px; text-align:right;">
            <button onclick="deleteRecipe(${r.id})" style="background:#ff4757; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">Eliminar Receta</button>
        </div>
    `;
    modal.classList.remove('hidden');
}

function closeRecipe() {
    modal.classList.add('hidden');
}

function deleteRecipe(id) {
    if (confirm("¿Deseas eliminar esta receta?")) {
        let recipes = JSON.parse(localStorage.getItem('myRecipes'));
        recipes = recipes.filter(r => r.id !== id);
        localStorage.setItem('myRecipes', JSON.stringify(recipes));
        closeRecipe();
        loadRecipes();
    }
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeRecipe();
    }
}

document.addEventListener('DOMContentLoaded', loadRecipes);