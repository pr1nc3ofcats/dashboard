export const scrollContainerIntoView = (event: any, container: HTMLElement, extraScroll: number = 0) => {
    const containerRect = container.getBoundingClientRect();
    const targetRect = event.target.getBoundingClientRect();

    // If > 0 element is beneath clip area and vice versa
    const offsetTop = targetRect.top - containerRect.top;
    // Same
    const offsetBottom = targetRect.bottom - containerRect.bottom;

    if (offsetTop < 0) {
        container.scrollTo({ top: container.scrollTop + offsetTop - extraScroll, behavior: 'smooth' })
    } else if (offsetBottom > 0) {
        container.scrollTo({ top: container.scrollTop + offsetBottom + extraScroll, behavior: 'smooth' })
    }
}