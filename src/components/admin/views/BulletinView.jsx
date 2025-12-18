import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Eye, FileText } from 'lucide-react';
import { firebaseService } from '../../../services/firebaseService';
import { useToast } from '../../ui/Toast/ToastContext';
import AdminModal from '../common/AdminModal';
import { AdminInput, AdminFile } from '../common/FormComponents';
import { fileToBase64, validateFile } from '../../../utils/fileHelpers';
import '../layout/AdminLayout.css';

const BulletinView = () => {
    const { toast } = useToast();
    const [bulletins, setBulletins] = useState([]);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({ title: '', month: '', poster: '', pdfUrl: '' });

    const [filesToUpload, setFilesToUpload] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { loadBulletins(); }, []);

    const loadBulletins = async () => {
        setBulletins(await firebaseService.getBulletins());
    };

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFileChange = async (e, field, type) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!validateFile(file, type).valid) {
            toast({ title: "Invalid File", description: `Please select a valid ${type} file.`, variant: "destructive" });
            return;
        }

        // Store raw file for upload
        setFilesToUpload(prev => ({ ...prev, [field]: file }));

        // For preview purposes on images, we can still use a temp URL or base64
        if (type === 'image') {
            try {
                const base64 = await fileToBase64(file);
                setFormData(prev => ({ ...prev, [field]: base64 }));
            } catch { }
        } else {
            // For PDF, just show the name or keep existing URL if editing
            setFormData(prev => ({ ...prev, [field]: file.name })); // Optional visual feedback
        }
    };

    const openAdd = () => {
        setFormData({ title: '', month: '', poster: '', pdfUrl: '' });
        setFilesToUpload({});
        setIsEditing(false);
        setIsFormModalOpen(true);
    };

    const openEdit = (item) => {
        setFormData({ ...item });
        setFilesToUpload({});
        setSelectedItem(item);
        setIsEditing(true);
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let updatedData = { ...formData };

            // Upload files if any
            if (Object.keys(filesToUpload).length > 0) {
                toast({ title: "Uploading...", description: "Please wait while files are being uploaded." });

                for (const [key, file] of Object.entries(filesToUpload)) {
                    if (file) {
                        const path = `bulletins/${Date.now()}_${file.name}`;
                        const url = await firebaseService.uploadFile(file, path);
                        updatedData[key] = url;
                    }
                }
            }

            if (isEditing) await firebaseService.updateBulletin(selectedItem.id, updatedData);
            else await firebaseService.addBulletin(updatedData);

            toast({ title: "Success", description: "Bulletin saved successfully", variant: "success" });
            setIsFormModalOpen(false);
            loadBulletins();
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to save bulletin.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this bulletin?")) {
            await firebaseService.deleteBulletin(id);
            loadBulletins();
        }
    };

    return (
        <div className="admin-view">
            <div className="view-header">
                <h2 className="view-title">Bulletins</h2>
                <button onClick={openAdd} className="btn-add-new"><Plus size={18} /> Add Bulletin</button>
            </div>

            <div className="admin-list-container">
                {bulletins.map(item => (
                    <div key={item.id} className="list-row-card">
                        <div className="row-content">
                            <h3 className="row-title">{item.title}</h3>
                            <p className="row-subtitle">Edition: {item.month}</p>
                        </div>
                        <div className="row-actions">
                            <button onClick={() => { setSelectedItem(item); setIsDetailModalOpen(true); }} className="action-btn view"><Eye size={18} /></button>
                            <button onClick={() => openEdit(item)} className="action-btn edit"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(item.id)} className="action-btn delete"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            <AdminModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={isEditing ? "Edit Bulletin" : "Add Bulletin"}>
                <form onSubmit={handleSubmit}>
                    <AdminInput label="Title" name="title" value={formData.title} onChange={handleInputChange} required />
                    <AdminInput label="Month/Edition" name="month" value={formData.month} onChange={handleInputChange} required />
                    <AdminFile label="Cover Image" accept="image/webp" onChange={(e) => handleFileChange(e, 'poster', 'image')} />
                    <AdminFile label="PDF File" accept="application/pdf" onChange={(e) => handleFileChange(e, 'pdfUrl', 'pdf')} />
                    <AdminInput name="pdfUrl" value={formData.pdfUrl} onChange={handleInputChange} placeholder="Or PDF URL" />
                    <button type="submit" className="admin-btn-primary" style={{ marginTop: '1.5rem' }} disabled={isSubmitting}>
                        {isSubmitting ? "Uploading..." : (isEditing ? "Update" : "Create")}
                    </button>
                </form>
            </AdminModal>

            <AdminModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Bulletin Details">
                {selectedItem && (
                    <div className="detail-view">
                        <img src={selectedItem.poster} alt="Cover" style={{ width: '150px', borderRadius: '8px', marginBottom: '1rem' }} />
                        <h3>{selectedItem.title}</h3>
                        <p><strong>Month:</strong> {selectedItem.month}</p>
                        <a href={selectedItem.pdfUrl} target="_blank" rel="noreferrer" className="admin-btn-primary" style={{ display: 'inline-block', width: 'auto', textDecoration: 'none' }}>View PDF</a>
                    </div>
                )}
            </AdminModal>
        </div>
    );
};

export default BulletinView;
