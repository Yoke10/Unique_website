import React, { useState, useEffect } from 'react'
import { mockDataService } from '../../services/mockDataService'
import { useToast } from '../ui/Toast/ToastContext'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "../ui/AlertDialog/AlertDialog"

const ResourceManager = () => {
    const { toast } = useToast()
    const [resources, setResources] = useState([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [newResource, setNewResource] = useState({ name: '', type: 'link', content: '' })
    const [uploadError, setUploadError] = useState('')
    const [alertConfig, setAlertConfig] = useState({ open: false, title: '', description: '', action: null })

    const showAlert = (title, description, action) => {
        setAlertConfig({ open: true, title, description, action })
    }

    const handleConfirmAction = () => {
        if (alertConfig.action) alertConfig.action()
        setAlertConfig({ ...alertConfig, open: false })
    }

    useEffect(() => {
        loadResources()
    }, [])

    const loadResources = async () => {
        try {
            const data = await mockDataService.getResources()
            setResources(data.sort((a, b) => new Date(b.date) - new Date(a.date)))
        } catch (error) {
            console.error("Failed to load resources:", error)
            toast({ title: "Error", description: "Failed to load resources", variant: "destructive" })
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            setUploadError("File is too large! Max 2MB allowed.")
            toast({ title: "Error", description: "File too large (Max 2MB)", variant: "destructive" })
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setNewResource({ ...newResource, content: reader.result })
            setUploadError('')
        }
        reader.readAsDataURL(file)
    }

    const handleAdd = async () => {
        if (!newResource.name || !newResource.content) {
            toast({ title: "Missing Fields", description: "Please fill all fields", variant: "warning" })
            return
        }
        await mockDataService.addResource(newResource)
        setNewResource({ name: '', type: 'link', content: '' })
        setIsAddModalOpen(false)
        loadResources()
        toast({ title: "Success", description: "Resource added successfully", variant: "success" })
    }

    const handleDelete = (id) => {
        showAlert("Delete Resource?", "Are you sure you want to delete this resource?", async () => {
            await mockDataService.deleteResource(id)
            loadResources()
            toast({ title: "Deleted", description: "Resource deleted", variant: "default" })
        })
    }

    const openResource = (res) => {
        if (res.type === 'link') {
            window.open(res.content, '_blank')
        } else {
            // For base64, usually opening in new window works
            const win = window.open()
            if (win) {
                win.document.write('<iframe src="' + res.content + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
            }
        }
    }

    return (
        <div style={{ padding: '2rem', background: 'white', borderRadius: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: '#d91b5c' }}>Resource Manager</h2>
                <button onClick={() => setIsAddModalOpen(true)} style={{ background: '#d91b5c', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>
                    + Add Resource
                </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {resources.map(res => (
                    <div key={res.id} style={{ border: '1px solid #eee', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1.5rem' }}>{res.type === 'link' ? '🔗' : (res.type === 'pdf' ? '📄' : '🖼️')}</span>
                            <h4 style={{ margin: 0, flex: 1 }}>{res.name}</h4>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>{new Date(res.date).toLocaleDateString()}</p>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                            <button onClick={() => openResource(res)} style={{ flex: 1, padding: '0.5rem', background: '#f0f0f0', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>View</button>
                            <button onClick={() => handleDelete(res.id)} style={{ padding: '0.5rem', background: '#ffebee', color: 'red', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ADD MODAL */}
            {isAddModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', width: '90%', maxWidth: '500px' }}>
                        <h3>Add New Resource</h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                            <input
                                value={newResource.name}
                                onChange={e => setNewResource({ ...newResource, name: e.target.value })}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '5px', border: '1px solid #ddd' }}
                                placeholder="Resource Name"
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Type</label>
                            <select
                                value={newResource.type}
                                onChange={e => setNewResource({ ...newResource, type: e.target.value, content: '' })}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '5px', border: '1px solid #ddd' }}
                            >
                                <option value="link">External Link</option>
                                <option value="pdf">PDF Document</option>
                                <option value="image">Image</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Content</label>
                            {newResource.type === 'link' ? (
                                <input
                                    value={newResource.content}
                                    onChange={e => setNewResource({ ...newResource, content: e.target.value })}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '5px', border: '1px solid #ddd' }}
                                    placeholder="https://example.com"
                                />
                            ) : (
                                <div>
                                    <input
                                        type="file"
                                        accept={newResource.type === 'pdf' ? '.pdf' : 'image/*'}
                                        onChange={handleFileChange}
                                        style={{ width: '100%' }}
                                    />
                                    {uploadError && <p style={{ color: 'red', fontSize: '0.8rem' }}>{uploadError}</p>}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => setIsAddModalOpen(false)} style={{ padding: '0.8rem 1.5rem', border: 'none', background: '#f0f0f0', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleAdd} style={{ padding: '0.8rem 1.5rem', border: 'none', background: '#d91b5c', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>Add Resource</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ALERT DIALOG */}
            <AlertDialog open={alertConfig.open} onOpenChange={(open) => setAlertConfig(prev => ({ ...prev, open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
                        <AlertDialogDescription>{alertConfig.description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmAction}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default ResourceManager
