
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

const TestimonialCard = ({ quote, author, role }: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="text-indigo-500 mb-4">
            <Quote size={24} />
          </div>
          <p className="text-gray-700 mb-6 italic">"{quote}"</p>
          <div className="border-t pt-4">
            <p className="font-semibold text-gray-900">{author}</p>
            <p className="text-gray-500 text-sm">{role}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;
