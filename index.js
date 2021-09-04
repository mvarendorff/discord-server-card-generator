const getForm = () => document.querySelector("form.inputs");
const getCopyButton = () => document.querySelector("button#copy-preview");
const getPreviewDiv = () => document.querySelector("div.preview");

const output = (text) => document.querySelector("span.output").innerText = text;

const generatePreview = async () => {
  const templateResponse = await fetch('template.html');
  const template = await templateResponse.text();

  const data = new FormData(getForm());

  const replaceInTemplate = (key, value, template) => template.replace('{{' + key + '}}', value);

  let completedTemplate = template;
  for (const [key, value] of data) {
    completedTemplate = replaceInTemplate(key, value, completedTemplate);
  }

  const wrapWithLink = (template, link) => '<a href="' + link + '">' + template + "</a>";
  if (data.has('inviteLink')) {
    completedTemplate = wrapWithLink(completedTemplate, data.get('inviteLink'));
  }

  return completedTemplate;
}

const showPreview = (previewHTML) => {
  const previewDiv = getPreviewDiv();
  previewDiv.innerHTML = previewHTML;

  const copyButton = getCopyButton();
  copyButton.style.display = "block";
}

const attachListeners = () => {
  const form = getForm();
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    generatePreview().then(showPreview);
    return false;
  });

  const copyButton = getCopyButton();
  copyButton.addEventListener('click', () => {
    const preview = getPreviewDiv().innerHTML;
    navigator.clipboard.writeText(preview).then(() => output('Copied the HTML to your clipboard.'));
  });
}

window.onload = attachListeners;
