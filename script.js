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
        
        const ingredientsArr = document.getElementById('ingredients').value.split(',').map(s => s.trim()).filter(s => s !== "");
        const procedureArr = document.getElementById('procedure').value.split(',').map(s => s.trim()).filter(s => s !== "");

        const recipe = {
            id: Date.now(),
            title: document.getElementById('title').value,
            ingredients: ingredientsArr,
            procedure: procedureArr,
            image: document.getElementById('image').value || 'https://via.placeholder.com/400?text=Comida'
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
        recipeList.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No tienes recetas guardadas.</p>';
        return;
    }

    recipes.forEach(r => {
        const div = document.createElement('div');
        div.className = 'recipe-card';
        div.onclick = () => openRecipe(r.id);
        div.innerHTML = `
            <img src="${r.image}">
            <h3>${r.title}</h3>
        `;
        recipeList.appendChild(div);
    });
}

function openRecipe(id) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
    const r = recipes.find(recipe => recipe.id === id);

    if (!r) return;

    const ings = Array.isArray(r.ingredients) ? r.ingredients : [r.ingredients];
    const steps = Array.isArray(r.procedure) ? r.procedure : [r.procedure];

    modalBody.innerHTML = `
        <img src="${r.image}" style="width:100%; height:200px; object-fit:cover; border-radius:10px;">
        <h2 style="margin: 15px 0; color: var(--primary);">${r.title}</h2>
        <div class="modal-grid">
            <div>
                <h4 style="margin-bottom:10px;">Ingredientes</h4>
                ${ings.map((ing, i) => `
                    <div class="check-item">
                        <input type="checkbox" id="ing-${i}">
                        <label for="ing-${i}">${ing}</label>
                    </div>
                `).join('')}
            </div>
            <div>
                <h4 style="margin-bottom:10px;">Pasos</h4>
                ${steps.map((step, i) => `
                    <div class="check-item">
                        <input type="checkbox" id="step-${i}">
                        <label for="step-${i}"><strong>${i+1}.</strong> ${step}</label>
                    </div>
                `).join('')}
            </div>
        </div>
        <button onclick="deleteRecipe(${r.id})" style="margin-top:20px; background:none; border:none; color:red; cursor:pointer; font-size:0.8rem;">Eliminar esta receta</button>
    `;
    modal.classList.remove('hidden');
}

function closeRecipe() {
    modal.classList.add('hidden');
}

function deleteRecipe(id) {
    if (confirm("¿Borrar receta?")) {
        let recipes = JSON.parse(localStorage.getItem('myRecipes'));
        recipes = recipes.filter(r => r.id !== id);
        localStorage.setItem('myRecipes', JSON.stringify(recipes));
        closeRecipe();
        loadRecipes();
    }
}

window.onclick = function(event) {
    if (event.target == modal) closeRecipe();
}

document.addEventListener('DOMContentLoaded', loadRecipes);