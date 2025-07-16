// public/form-handler.js
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('second-hand-form');
  
  if (!form) {
    console.error('Form not found. Make sure the form ID is correct.');
    return;
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    try {
      const response = await fetch('https://your-vercel-app.vercel.app/api/create-cms-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        showMessage('Thank you! Your submission has been received.', 'success');
        form.reset();
      } else {
        showMessage(result.message || 'Something went wrong. Please try again.', 'error');
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      showMessage('Network error. Please check your connection and try again.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
});

function showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    padding: 15px;
    margin: 10px 0;
    border-radius: 4px;
    font-weight: 500;
    ${type === 'success' 
      ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
      : 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
    }
  `;
  
  const form = document.getElementById('your-form-id');
  form.parentNode.insertBefore(messageDiv, form.nextSibling);
  
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}