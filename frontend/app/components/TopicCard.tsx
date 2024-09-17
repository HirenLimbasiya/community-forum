import { useRouter } from "next/navigation";
import { Topic } from "../types/topic";
import { useState } from "react";

const TopicCard = ({ id, title, body, is_closed }: Topic) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/topic/${id}`); // Navigate to topic detail page
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-lg p-6 shadow-lg transition-all hover:shadow-xl hover:bg-gray-50"
    >
      <h3 className="text-2xl font-semibold text-darkBlue mb-2">{title}</h3>
      <p className="text-navy mb-4">{body.substring(0, 100)}...</p>
      <div className="flex justify-end">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
            is_closed ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
          }`}
        >
          {is_closed ? "Closed" : "Open"}
        </span>
      </div>
    </div>
  );
};

interface TopicCardWithManagebaleProps extends Topic {
  onDelete: (id: string) => void; // Function to handle delete action
}

const UserTopicCard = ({
  id,
  title,
  body,
  is_closed,
  onDelete,
}: TopicCardWithManagebaleProps) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false); // State to manage hover

  const handleClick = () => {
    router.push(`/topic/${id}`); // Navigate to topic detail page
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    onDelete(id); // Call the delete handler passed from parent
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative cursor-pointer bg-white rounded-lg p-6 shadow-lg transition-all hover:shadow-xl hover:bg-gray-50"
    >
      <h3 className="text-2xl font-semibold text-darkBlue mb-2">{title}</h3>
      <p className="text-navy mb-4">{body.substring(0, 100)}...</p>
      <div className="flex justify-end">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
            is_closed
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {is_closed ? "Closed" : "Open"}
        </span>
      </div>

      {isHovered && (
        <button
          onClick={handleDelete}
          className="absolute top-4 right-4 text-red-600 hover:text-red-800 bg-transparent border-none focus:outline-none"
        >
          Delete
        </button>
      )}
    </div>
  );
};
export { UserTopicCard };
export default TopicCard;
