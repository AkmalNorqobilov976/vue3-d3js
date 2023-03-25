import { DirectiveBinding, App } from "vue";

const tooltipDirective = (app: App) => {
    app.directive("tooltip", {
      mounted(el: HTMLElement, binding: DirectiveBinding) {
        init(el, binding);
      },
      updated(el: HTMLElement, binding: DirectiveBinding) {
        init(el, binding);
      }
    });
  };
  
  function init(el: HTMLElement, binding: DirectiveBinding) {
    const position: any = binding.arg || "top";
    const tooltipText: any = binding.value || "Tooltip text";
    el.setAttribute("position", position);
    el.setAttribute("tooltip", tooltipText);
  }
  
  export default tooltipDirective;