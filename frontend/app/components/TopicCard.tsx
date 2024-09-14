import { useRouter } from "next/navigation";
import { Topic } from "../types/topic";

const TopicCard = ({ id, title, body, isClosed }: Topic) => {
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
            isClosed ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
          }`}
        >
          {isClosed ? "Closed" : "Open"}
        </span>
      </div>
    </div>
  );
};

export default TopicCard;
