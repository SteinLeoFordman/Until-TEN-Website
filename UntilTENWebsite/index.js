const revealElements = document.querySelectorAll('.card, .about, .contact');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry =>{
        if (entry.isIntersecting){
            entry.target.classList.add('visible');
        }
    });
}, {threshold:0.2});
revealElements.forEach(el => observer.observe(el));