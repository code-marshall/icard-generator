// Get form elements
const companyLogoInput = document.getElementById('companyLogo');
const companyNameInput = document.getElementById('companyName');
const employeePhotoInput = document.getElementById('employeePhoto');
const fullNameInput = document.getElementById('fullName');
const employeeIdInput = document.getElementById('employeeId');
const designationInput = document.getElementById('designation');
const bloodGroupInput = document.getElementById('bloodGroup');

// Get preview elements
const previewLogo = document.getElementById('previewLogo');
const previewCompanyName = document.getElementById('previewCompanyName');
const previewPhoto = document.getElementById('previewPhoto');
const previewName = document.getElementById('previewName');
const previewId = document.getElementById('previewId');
const previewDesignation = document.getElementById('previewDesignation');
const previewBloodGroup = document.getElementById('previewBloodGroup');

// Get buttons
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Handle company logo upload
companyLogoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            previewLogo.src = event.target.result;
            previewLogo.classList.add('show');
        };
        reader.readAsDataURL(file);
    }
});

// Handle employee photo upload with cropping
const employeePhotoImg = document.getElementById('employeePhotoImg');
const photoPlaceholder = document.querySelector('.photo-placeholder');
const cropModal = document.getElementById('cropModal');
const cropImage = document.getElementById('cropImage');
const cancelCropBtn = document.getElementById('cancelCrop');
const applyCropBtn = document.getElementById('applyCrop');
let cropper = null;

employeePhotoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            // Show crop modal
            cropImage.src = event.target.result;
            cropModal.classList.add('show');

            // Initialize cropper
            if (cropper) {
                cropper.destroy();
            }

            cropper = new Cropper(cropImage, {
                aspectRatio: 1,
                viewMode: 1,
                autoCropArea: 1,
                responsive: true,
                background: false,
                guides: true,
                center: true,
                highlight: true,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,
            });
        };
        reader.readAsDataURL(file);
    }
});

// Cancel crop
cancelCropBtn.addEventListener('click', function() {
    cropModal.classList.remove('show');
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    employeePhotoInput.value = '';
});

// Apply crop
applyCropBtn.addEventListener('click', function() {
    if (cropper) {
        const canvas = cropper.getCroppedCanvas({
            width: 500,
            height: 500,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        });

        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            employeePhotoImg.src = url;
            employeePhotoImg.style.display = 'block';
            photoPlaceholder.style.display = 'none';

            // Close modal
            cropModal.classList.remove('show');
            cropper.destroy();
            cropper = null;
        }, 'image/png', 1.0);
    }
});

// Generate button click handler
generateBtn.addEventListener('click', function() {
    // Validate required fields
    if (!companyNameInput.value.trim()) {
        alert('Please enter company name');
        return;
    }
    if (!fullNameInput.value.trim()) {
        alert('Please enter full name');
        return;
    }
    if (!employeeIdInput.value.trim()) {
        alert('Please enter employee ID');
        return;
    }
    if (!designationInput.value.trim()) {
        alert('Please enter designation');
        return;
    }
    if (!bloodGroupInput.value) {
        alert('Please select blood group');
        return;
    }

    // Update card preview
    previewCompanyName.textContent = companyNameInput.value.toUpperCase();
    previewName.textContent = fullNameInput.value;
    previewId.textContent = employeeIdInput.value;
    previewDesignation.textContent = designationInput.value;
    previewBloodGroup.textContent = bloodGroupInput.value;

    alert('ID Card generated successfully! You can now download it.');
});

// Download button click handler
downloadBtn.addEventListener('click', async function() {
    // Check if card is generated
    if (previewName.textContent === 'John Doe') {
        alert('Please generate the card first before downloading');
        return;
    }

    try {
        // Use html2canvas to capture the card
        const card = document.getElementById('idCard');

        // Import html2canvas dynamically
        if (typeof html2canvas === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            document.head.appendChild(script);

            script.onload = function() {
                captureAndDownload(card);
            };
        } else {
            captureAndDownload(card);
        }
    } catch (error) {
        console.error('Error downloading card:', error);
        alert('Error downloading card. Please try again.');
    }
});

function captureAndDownload(card) {
    html2canvas(card, {
        scale: 4,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 0,
        removeContainer: true,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowHeight: card.scrollHeight,
        height: card.scrollHeight
    }).then(function(canvas) {
        // Convert canvas to blob with high quality PNG
        canvas.toBlob(function(blob) {
            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `ID_Card_${employeeIdInput.value}.png`;
            link.href = url;
            link.click();

            // Clean up
            URL.revokeObjectURL(url);
        }, 'image/png', 1.0);
    });
}

// Real-time preview updates (optional)
companyNameInput.addEventListener('input', function() {
    const companyName = this.value || 'Company Name';
    previewCompanyName.textContent = companyName.toUpperCase();
});

fullNameInput.addEventListener('input', function() {
    previewName.textContent = this.value || 'John Doe';
});

employeeIdInput.addEventListener('input', function() {
    previewId.textContent = this.value || 'EMP001';
});

designationInput.addEventListener('input', function() {
    previewDesignation.textContent = this.value || 'Software Engineer';
});

bloodGroupInput.addEventListener('change', function() {
    previewBloodGroup.textContent = this.value || 'O+';
});
