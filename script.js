const recipeForm = document.getElementById('recipe-form');
const recipeList = document.getElementById('recipe-list');
const modal = document.getElementById('recipe-modal');
const modalBody = document.getElementById('modal-body');

function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

recipeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const recipe = {
        id: Date.now(),
        title: document.getElementById('title').value,
        ingredients: document.getElementById('ingredients').value.split(','),
        procedure: document.getElementById('procedure').value.split(','),
        image: document.getElementById('image').value || 'https://via.placeholder.com/400'
    };

    let recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
    recipes.push(recipe);
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
    
    recipeForm.reset();
    showSection('recetas');
    loadRecipes();
});

function loadRecipes() {
    let recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
    recipeList.innerHTML = '';
    recipes.forEach(r => {
        const div = document.createElement('div');
        div.className = 'recipe-card';
        div.onclick = () => openRecipe(r.id);
        div.innerHTML = `
            <img src="${r.image}">
            <h3>${r.title}</h3>
            <p style="padding: 10px; font-size: 0.8rem; color: #666;">Haz clic para ver pasos</p>
        `;
        recipeList.appendChild(div);
    });
}

function openRecipe(id) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes'));
    const r = recipes.find(recipe => recipe.id === id);

    modalBody.innerHTML = `
        <img src="${r.image}" style="width:100%; height:250px; object-fit:cover; border-radius:10px;">
        <h2 style="font-size:2rem; margin-top:15px;">${r.title}</h2>
        
        <div class="modal-grid">
            <div>
                <h3>Ingredientes</h3>
                ${r.ingredients.map((ing, i) => `
                    <div class="check-item">
                        <input type="checkbox" id="ing-${i}">
                        <label for="ing-${i}">${ing.trim()}</label>
                    </div>
                `).join('')}
            </div>
            <div>
                <h3>Preparación</h3>
                ${r.procedure.map((step, i) => `
                    <div class="check-item">
                        <input type="checkbox" id="step-${i}">
                        <label for="step-${i}"><strong>Paso ${i+1}:</strong> ${step.trim()}</label>
                    </div>
                `).join('')}
            </div>
        </div>
        <button onclick="deleteRecipe(${r.id})" style="margin-top:30px; background:none; border:none; color:red; cursor:pointer;">🗑 Eliminar receta permanentemente</button>
    `;
    modal.classList.remove('hidden');
}

function closeRecipe() { modal.classList.add('hidden'); }

function deleteRecipe(id) {
    if(confirm("¿Seguro que quieres borrarla?")) {
        let recipes = JSON.parse(localStorage.getItem('myRecipes'));
        recipes = recipes.filter(r => r.id !== id);
        localStorage.setItem('myRecipes', JSON.stringify(recipes));
        closeRecipe();
        loadRecipes();
    }
}

document.addEventListener('DOMContentLoaded', loadRecipes);