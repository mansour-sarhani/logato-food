import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import getCommentForShop from '@/functions/comment/getCommentForShop';
import AddCommentForm from '@/components/forms/AddCommentForm';
import PanelModal from '@/components/panel/PanelModal';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Alert from '@mui/material/Alert';

export default function ShopComments({ shop, user }) {
    const [comments, setComments] = useState();
    const [doReload, setDoReload] = useState(true);

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (doReload) {
            async function fetchComments() {
                await getCommentForShop(
                    dispatch,
                    enqueueSnackbar,
                    shop.id,
                    setComments
                );
            }
            fetchComments();
        }
        setDoReload(false);
    }, [doReload]);

    return (
        <div className="shop-comments">
            <div className="shop-single-heading">
                <Typography variant="h5">نظرات کاربران</Typography>
            </div>
            {user === null ? (
                <Alert severity="info" sx={{ marginBottom: '10px' }}>
                    برای ثبت نظر باید ابتدا وارد حساب کاربری خود شوید.
                </Alert>
            ) : (
                <div className="shop-new-comment">
                    <PanelModal
                        buttonLabel="ثبت نظر"
                        modalHeader="ثبت نظر"
                        icon="comment"
                    >
                        <AddCommentForm
                            commentOn="shop"
                            shop={shop}
                            user={user}
                            isOriginalComment={true}
                            setDoReload={setDoReload}
                        />
                    </PanelModal>
                </div>
            )}
            <div className="shop-comments-wrapper">
                {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="shop-comment">
                            <div className="shop-original-comment">
                                <div className="shop-comment-header">
                                    <Typography variant="h6">
                                        {comment.userName}
                                    </Typography>
                                    <Rating
                                        name="read-only"
                                        value={comment.rating}
                                        precision={0.5}
                                        readOnly
                                        size="small"
                                        sx={{
                                            direction: 'ltr',
                                        }}
                                    />
                                </div>
                                <div className="shop-comment-body">
                                    <Typography variant="body2">
                                        {comment.body}
                                    </Typography>
                                </div>
                            </div>
                            {comment.responseBody && (
                                <div className="shop-response-comment">
                                    <div className="shop-comment-header">
                                        <Typography variant="h6">
                                            فروشگاه:
                                        </Typography>
                                    </div>
                                    <div className="shop-comment-body">
                                        <Typography variant="body2">
                                            {comment.responseBody}
                                        </Typography>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <Alert severity="info" sx={{ marginBottom: '10px' }}>
                        نظری برای این فروشگاه ثبت نشده است.
                    </Alert>
                )}
            </div>
        </div>
    );
}
