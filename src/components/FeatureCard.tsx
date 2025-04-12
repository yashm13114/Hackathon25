
import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="h-full shadow hover:shadow-md transition-shadow">
        <CardHeader className="pb-3 pt-6 flex flex-col items-center">
          <div className="mb-4">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </CardHeader>
        <CardContent className="text-center text-gray-600">
          <p>{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
