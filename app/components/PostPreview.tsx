'use client'
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '../lib/supabase';
import { X, MoreHorizontal, Check, Edit2, Trash2, Heart } from 'lucide-react';

interface Post {
    id: string;
    user_id: string;
    description: string;
    image_url: string;
    created_at: string;
    likes: number;
    category: string;
}

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user_id: string;
    comment_reply_id: string | null;
    user: {
        username: string;
        image_url: string | null;
    };
}

interface PostPreviewProps {
    post: Post;
    onClose: () => void;
    onPostUpdated?: (post: Post) => void;
    onPostDeleted?: (postId: string) => void;
}

const PostPreview: React.FC<PostPreviewProps> = ({ post, onClose, onPostUpdated, onPostDeleted }) => {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editDescription, setEditDescription] = useState(post.description);
    const [editCategory, setEditCategory] = useState(post.category);
    const [savingEdit, setSavingEdit] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
        const [liked, setLiked] = useState(false);
        const [likeAnimating, setLikeAnimating] = useState(false);
        const [likes, setLikes] = useState(post.likes);
        const [showMenu, setShowMenu] = useState(false);
        const menuRef = useRef<HTMLDivElement | null>(null);
        const menuButtonRef = useRef<HTMLButtonElement | null>(null);
        const [postUser, setPostUser] = useState<{ username: string; image_url: string | null } | null>(null);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setCurrentUserId(user.id);
        await Promise.all([fetchComments(), fetchLikeStatus(), fetchPostUser()]);
        };
        init();
    }, [post.id]);

    // Close menu when clicking outside
    useEffect(() => {
        if (!showMenu) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            if (menuRef.current && !menuRef.current.contains(target) && menuButtonRef.current && !menuButtonRef.current.contains(target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showMenu]);

    const fetchComments = async () => {
        setLoadingComments(true);
        const { data, error } = await supabase
            .from('comment')
            .select(`id, content, created_at, user_id, comment_reply_id, user:users ( username, image_url )`)
            .eq('post_id', post.id)
            .order('created_at', { ascending: true });
        if (!error && data) setComments(data as unknown as Comment[]);
        setLoadingComments(false);
    };

        const fetchPostUser = async () => {
            const { data } = await supabase.from('users').select('username, image_url').eq('id', post.user_id).maybeSingle();
            if (data) setPostUser(data as any);
        };

        const fetchLikeStatus = async () => {
            if (!currentUserId) return; 
            const { data, error } = await supabase
                .from('post_likes')
                .select('id')
                .eq('post_id', post.id)
                .eq('user_id', currentUserId)
                .maybeSingle();
            if (!error && data) setLiked(true); else setLiked(false);
        };

        useEffect(() => { if (currentUserId) fetchLikeStatus(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [currentUserId]);

        const toggleLike = async () => {
            if (!currentUserId) return;
            if (liked) {
                await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', currentUserId);
                setLiked(false);
                setLikes(l => Math.max(0, l - 1));
                await supabase.from('posts').update({ likes: likes - 1 }).eq('id', post.id);
            } else {
                await supabase.from('post_likes').insert([{ post_id: post.id, user_id: currentUserId }]);
                setLiked(true);
                setLikes(l => l + 1);
                await supabase.from('posts').update({ likes: likes + 1 }).eq('id', post.id);
            }
        };

        const handleDoubleClick = () => {
            if (!liked) {
                toggleLike();
                setLikeAnimating(true);
                setTimeout(() => setLikeAnimating(false), 900);
            } else {
                setLikeAnimating(true);
                setTimeout(() => setLikeAnimating(false), 700);
            }
        };

        const relativeTime = (dateStr: string) => {
            const diff = Date.now() - new Date(dateStr).getTime();
            const s = Math.floor(diff / 1000);
            if (s < 60) return `${s}s`;
            const m = Math.floor(s / 60); if (m < 60) return `${m}m`;
            const h = Math.floor(m / 60); if (h < 24) return `${h}h`;
            const d = Math.floor(h / 24); if (d < 7) return `${d}d`;
            const w = Math.floor(d / 7); if (w < 4) return `${w}w`;
            const mo = Math.floor(d / 30); if (mo < 12) return `${mo}mo`;
            const y = Math.floor(d / 365); return `${y}y`;
        };

    const handleAddComment = async () => {
        if (!newComment.trim() || !currentUserId) return;
        const content = newComment.trim();
        setNewComment('');
        const { error } = await supabase.from('comment').insert([{ post_id: post.id, user_id: currentUserId, content }]);
        if (error) {
            setError(error.message);
        } else {
            fetchComments();
        }
    };

    const handleSaveEdit = async () => {
        if (savingEdit) return;
        setSavingEdit(true);
        const { error } = await supabase
            .from('posts')
            .update({ description: editDescription, category: editCategory })
            .eq('id', post.id);
        if (error) {
            setError(error.message);
        } else {
            const updated: Post = { ...post, description: editDescription, category: editCategory };
            onPostUpdated?.(updated);
            setIsEditing(false);
        }
        setSavingEdit(false);
    };

    const extractStoragePath = (publicUrl: string) => {
        const marker = '/storage/v1/object/public/posts/';
        const idx = publicUrl.indexOf(marker);
        if (idx === -1) return null;
        return publicUrl.substring(idx + marker.length);
    };

    const handleDelete = async () => {
        if (!confirm('Hapus postingan ini?')) return;
        setDeleting(true);
        const path = extractStoragePath(post.image_url);
        if (path) {
            await supabase.storage.from('posts').remove([path]);
        }
        const { error } = await supabase.from('posts').delete().eq('id', post.id);
        if (error) {
            setError(error.message);
            setDeleting(false);
            return;
        }
        onPostDeleted?.(post.id);
        setDeleting(false);
        onClose();
    };

    const isOwner = currentUserId === post.user_id;

        return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
                <div className="bg-white rounded-2xl w-full max-w-5xl h-[82vh] flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
                    {/* Image Section */}
                    <div className="relative md:w-1/2 w-full bg-black flex items-center justify-center select-none" onDoubleClick={handleDoubleClick}>
                        <Image src={post.image_url} alt={post.description} fill className="object-contain" />
                        {likeAnimating && (
                            <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                                <Heart className="w-32 h-32 text-white/90 fill-white/90 drop-shadow-[0_0_10px_rgba(0,0,0,0.4)]" />
                            </div>
                        )}
                        <button onClick={onClose} className="absolute top-3 left-3 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex flex-col md:w-1/2 w-full h-full">
                            <div className="flex items-center justify-between px-5 py-3 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                        {postUser?.image_url && <Image src={postUser.image_url} alt={postUser.username} width={40} height={40} className="object-cover w-full h-full" />}
                                    </div>
                                    <div className="leading-tight">
                                        <p className="font-semibold text-sm">{postUser?.username || 'Pengguna'}</p>
                                        <p className="text-[11px] text-gray-500 flex items-center gap-1">
                                            <span>{relativeTime(post.created_at)}</span>
                                            {post.category && <span className="px-1.5 py-0.5 bg-gray-100 rounded-full text-[10px] font-medium">#{post.category}</span>}
                                        </p>
                                    </div>
                                </div>
                                {isOwner && (
                                    <div className="relative">
                                        <button ref={menuButtonRef} onClick={() => setShowMenu(s => !s)} className="p-2 hover:bg-gray-100 rounded-full" title="Menu">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                        {showMenu && (
                                            <div ref={menuRef} className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-10 overflow-hidden text-sm">
                                                <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-50"><Edit2 className="w-4 h-4" /> Edit</button>
                                                <button onClick={handleDelete} disabled={deleting} className="w-full px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /> Hapus</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                            <div>
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <p>Kategori</p>
                                        <input
                                            value={editCategory}
                                            onChange={e => setEditCategory(e.target.value)}
                                            className="w-full border rounded-md px-3 py-2 text-sm"
                                            placeholder="Kategori"
                                        />
                                        <p>Deskripsi</p>
                                        <textarea
                                            value={editDescription}
                                            onChange={e => setEditDescription(e.target.value)}
                                            className="w-full border rounded-md px-3 py-2 text-sm min-h-[100px] resize-none"
                                            placeholder="Deskripsi"
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={handleSaveEdit} disabled={savingEdit} className="flex-1 bg-black text-white py-2 rounded-full text-sm font-medium disabled:opacity-50">{savingEdit ? 'Menyimpan...' : 'Simpan'}</button>
                                            <button onClick={() => { setIsEditing(false); setEditDescription(post.description); setEditCategory(post.category); }} className="flex-1 border py-2 rounded-full text-sm font-medium">Batal</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm leading-relaxed whitespace-pre-line break-words">{post.description}</p>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <button onClick={toggleLike} aria-label="like" className="group">
                                    <Heart className={`w-6 h-6 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-700 group-hover:text-black'}`} />
                                </button>
                                <p className="font-medium text-gray-800">{likes} suka</p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold">Komentar</h4>
                                {loadingComments ? (
                                    <p className="text-xs text-gray-500">Memuat komentar...</p>
                                ) : comments.length === 0 ? (
                                    <p className="text-xs text-gray-400">Belum ada komentar.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {comments.map(c => (
                                            <li key={c.id} className="flex items-start gap-3 group">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                                    {c.user?.image_url && <Image src={c.user.image_url} alt={c.user.username} width={32} height={32} className="object-cover w-full h-full" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm leading-snug"><span className="font-semibold mr-2">{c.user?.username}</span>{c.content}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <p className="text-[10px] text-gray-400">{relativeTime(c.created_at)}</p>
                                                        {c.user_id === currentUserId && !isEditing && (
                                                            <button
                                                                onClick={async () => { await supabase.from('comment').delete().eq('id', c.id); fetchComments(); }}
                                                                className="text-[10px] text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >Hapus</button>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        {currentUserId && !isEditing && (
                            <div className="border-t px-5 py-3 flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Tambahkan komentar..."
                                    className="flex-1 text-sm border rounded-full px-4 py-2"
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddComment(); } }}
                                />
                                <button
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim()}
                                    className="text-sm font-medium text-black disabled:opacity-30"
                                >Kirim</button>
                            </div>
                        )}
                        {error && <p className="px-5 pb-3 text-xs text-red-500">{error}</p>}
                    </div>
                </div>
            </div>
        );
};

export default PostPreview;
