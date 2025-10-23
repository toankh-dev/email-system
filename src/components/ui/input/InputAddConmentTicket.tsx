import { useState } from 'react';
import { addComment } from '@/services/ticket_detail.service';
import { SmilePlus, Undo, ChevronDown } from 'lucide-react';
import { formatDate } from '@/lib/client/utils';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import type { IComment } from '@/types/api';

interface InputAddCommentTicketProps {
  messageId: number;
  listComment: IComment[];
  fetchTicketDetail: () => void;
}

const InputAddCommentTicket = (props: InputAddCommentTicketProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleError } = useErrorHandler();

  const handleAddComment = async () => {
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const data = {
        ticket_id: 0, // TODO: Get ticket_id from props or context
        message_id: props.messageId,
        content: comment.trim(),
      };

      await addComment(data);

      setComment('');
      setIsFocused(false);
      props.fetchTicketDetail();
    } catch (error) {
      handleError(error, { context: 'addComment', messageId: props.messageId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-color mt-4 rounded border-1 bg-gray-50 p-3">
      <div className="flex items-start gap-2">
        {/* Avatar Placeholder */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm text-white">💬</div>
        <div className="flex-1">
          <textarea
            placeholder="コメントを追加"
            className="border-color w-full resize-none rounded border-1 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={isFocused ? 3 : 1}
            onFocus={() => setIsFocused(true)}
            onChange={e => setComment(e.target.value)}
            value={comment}
          />
          {isFocused && (
            <div className="mt-2 flex justify-end gap-2">
              <button
                className="rounded border px-4 py-1 text-sm text-gray-600 hover:bg-gray-100"
                onClick={() => {
                  setComment('');
                  setIsFocused(false);
                }}
              >
                キャンセル
              </button>
              <button
                className={`rounded bg-green-500 px-4 py-1 text-sm text-white ${
                  comment.trim() === '' || isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-600'
                }`}
                disabled={comment.trim() === '' || isSubmitting}
                onClick={handleAddComment}
              >
                {isSubmitting ? '送信中...' : '投稿'}
              </button>
            </div>
          )}
        </div>
      </div>
      {props.listComment.length > 0 && (
        <div className="mt-4">
          {props.listComment.map(item => (
            <div key={item.id} className="rounde py-2">
              <div className="flex items-start justify-between">
                <div className="flex gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">💬</div>
                  <div>
                    <div className="font-semibold text-gray-800">{item.user?.name || 'User'}</div>
                    <div className="text-sm text-gray-700">{item.content}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 text-right text-xs text-gray-500">
                  <div className="group relative flex items-center gap-2">
                    {formatDate(item.createdAt, {
                      year: '2-digit',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    <Undo className="h-4 w-4" />
                    <SmilePlus className="h-4 w-4" />
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputAddCommentTicket;
