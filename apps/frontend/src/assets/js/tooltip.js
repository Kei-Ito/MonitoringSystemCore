/* eslint-env browser */
import bootstrap from "bootstrap/dist/js/bootstrap";

// initialization of Tooltips
export default function setTooltip() {
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}
