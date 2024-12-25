export function convertProseMirrorToHTML(content: any): string {
    const convertNode = (node: any): string => {
      switch (node.type) {
        case "paragraph":
          return `<p>${convertContent(node.content)}</p>`;
  
        case "heading":
          return `<h${node.attrs.level}>${convertContent(node.content)}</h${node.attrs.level}>`;
  
        case "bulletList":
          return `<ul class="list-disc list-outside leading-3 -mt-2 tight">${convertContent(node.content)}</ul>`;
  
        case "orderedList":
          return `<ol class="list-decimal list-outside leading-3 -mt-2 tight">${convertContent(node.content)}</ol>`;
  
        case "listItem":
          return `<li>${convertContent(node.content)}</li>`;
  
        case "taskList":
          return `<ul class="not-prose pl-2 " data-type="taskList">${convertContent(node.content)}</ul>`;
  
        case "taskItem":
          const checked = node.attrs.checked ? "checked='checked'" : "";
          return `<li class="flex gap-2 items-start my-4" data-checked="${node.attrs.checked}" data-type="taskItem">
                    <label><input type="checkbox" ${checked}><span></span></label>
                    <div>${convertContent(node.content)}</div>
                  </li>`;
  
        case "blockquote":
          return `<blockquote class="border-l-4 border-primary">${convertContent(node.content)}</blockquote>`;
  
        case "codeBlock":
          return `<pre><code>${convertContent(node.content)}</code></pre>`;
  
        case "image":
          return `<img class="rounded-lg border border-muted" src="${node.attrs.src}" alt="${node.attrs.alt || ''}" />`;
  
        case "text":
          return node.text || "";
  
        default:
          return "";
      }
    };
  
    const convertContent = (content: any[]): string => {
      return content?.map(convertNode).join("") || "";
    };
  
    return convertContent(content.content);
  }
  