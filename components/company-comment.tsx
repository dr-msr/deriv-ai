import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export type Comment = {
    id: number
    author: string
    avatarUrl: string
    content: string
    likes: number
    dislikes: number
  }

function CommentComponent({
    comment,
    onLike,
    onDislike,
  }: { comment: Comment; onLike: () => void; onDislike: () => void }) {
    return (
      <div className="flex items-start space-x-2 mb-2 text-sm">
        <Avatar className="h-6 w-6">
          <AvatarImage src={comment.avatarUrl} alt={comment.author} />
          <AvatarFallback>{comment.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{comment.author}</p>
          <p className="text-gray-600 mb-1">{comment.content}</p>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-6 px-1" onClick={onLike}>
              <ThumbsUp className="h-3 w-3 mr-1" />
              {comment.likes}
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-1" onClick={onDislike}>
              <ThumbsDown className="h-3 w-3 mr-1" />
              {comment.dislikes}
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
export function CommentSection({
    comments,
    setComments,
  }: { comments: Comment[]; setComments: React.Dispatch<React.SetStateAction<Comment[]>> }) {
    const handleLike = (id: number) => {
      setComments(comments.map((comment) => (comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment)))
    }
  
    const handleDislike = (id: number) => {
      setComments(
        comments.map((comment) => (comment.id === id ? { ...comment, dislikes: comment.dislikes + 1 } : comment)),
      )
    }
  
    return (
      <div className="p-4">
        <h3 className="text-sm font-semibold mb-2">Comments</h3>
        {comments.map((comment) => (
          <CommentComponent
            key={comment.id}
            comment={comment}
            onLike={() => handleLike(comment.id)}
            onDislike={() => handleDislike(comment.id)}
          />
        ))}
      </div>
    )
  }