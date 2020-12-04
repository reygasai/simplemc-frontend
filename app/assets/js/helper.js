export function replaceActiveClass(container, changeElement) {
    let list = container.childNodes;
    list.forEach(element => {
        if(element.classList !== undefined) {
            element.classList.remove('active');
        }
    });

    changeElement.classList.add('active');
}