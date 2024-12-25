// Function to get a specific cookie by name
export function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    // Check if parts has at least two elements and parts.pop() is defined
    const cookiePart = parts.length === 2 ? parts.pop() : undefined;
  
    if (cookiePart) {
      return cookiePart.split(";").shift();
    }
  
    return undefined; // Return undefined if cookie not found
  }
  