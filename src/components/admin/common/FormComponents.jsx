import React, { useState, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import '../layout/AdminLayout.css';

// Reusable Input
export const AdminInput = ({ label, error, ...props }) => (
    <div className={`admin-form-group ${error ? 'has-error' : ''}`}>
        {label && <label className="admin-label">{label} {props.required && <span className="required-star">*</span>}</label>}
        <input className="admin-input-field" {...props} />
        {error && <span className="error-text"><AlertCircle size={12} /> {error}</span>}
    </div>
);

// Reusable Textarea
export const AdminTextarea = ({ label, error, ...props }) => (
    <div className={`admin-form-group ${error ? 'has-error' : ''}`}>
        {label && <label className="admin-label">{label} {props.required && <span className="required-star">*</span>}</label>}
        <textarea className="admin-textarea-field" {...props} />
        {error && <span className="error-text"><AlertCircle size={12} /> {error}</span>}
    </div>
);

// Reusable Select
export const AdminSelect = ({ label, options, error, ...props }) => (
    <div className={`admin-form-group ${error ? 'has-error' : ''}`}>
        {label && <label className="admin-label">{label} {props.required && <span className="required-star">*</span>}</label>}
        <select className="admin-select-field" {...props}>
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
        {error && <span className="error-text"><AlertCircle size={12} /> {error}</span>}
    </div>
);

// Enhanced File Upload
export const AdminFile = ({ label, onChange, accept, error, multiple, ...props }) => {
    const [fileName, setFileName] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            if (multiple) {
                setFileName(`${files.length} files selected`);
            } else {
                setFileName(files[0].name);
            }
        } else {
            setFileName('');
        }
        if (onChange) onChange(e);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (inputRef.current) {
            inputRef.current.files = e.dataTransfer.files;
            // Manually trigger onChange logic
            const event = { target: { files: e.dataTransfer.files }, preventDefault: () => { } };
            handleFileChange(event);
        }
    };

    const getHelperText = () => {
        if (accept && accept.includes('image')) return "WEBP ONLY (Max 2MB)";
        if (accept && accept.includes('pdf')) return "PDF ONLY (Max 5MB)";
        return "WEBP or PDF (Max 5MB)";
    };

    return (
        <div className={`admin-form-group ${error ? 'has-error' : ''}`}>
            {label && <label className="admin-label">{label} {props.required && <span className="required-star">*</span>}</label>}

            <div
                className={`admin-file-container ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <div className="file-input-wrapper">
                    <button type="button" className="btn-choose-file">
                        Choose File
                    </button>
                    <span className="file-name-display">
                        {fileName || "No file chosen"}
                    </span>
                </div>

                <div className="file-helper-text">
                    {multiple ? "Drop files here or click to upload" : "Drop file here or click to upload"}
                    <br />
                    <span className="file-limits">{getHelperText()}</span>
                </div>

                <input
                    type="file"
                    ref={inputRef}
                    className="hidden-file-input"
                    onChange={handleFileChange}
                    accept={accept}
                    multiple={multiple}
                    {...props}
                />
            </div>
            {error && <span className="error-text"><AlertCircle size={12} /> {error}</span>}
        </div>
    );
};
