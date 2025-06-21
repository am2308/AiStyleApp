import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, Users, ArrowRight, Clock, Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface StyleChallengeCardProps {
  challenge: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    startDate: string;
    endDate: string;
    participants: number;
    entries: number;
    isActive: boolean;
    isJoined: boolean;
    daysLeft: number;
    prizes?: {
      name: string;
      description: string;
    }[];
  };
  onJoin: () => void;
}

const StyleChallengeCard: React.FC<StyleChallengeCardProps> = ({ challenge, onJoin }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleViewChallenge = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to the challenge detail page
    navigate(`/community?tab=challenges&challenge=${challenge.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden"
    >
      {/* Challenge Image */}
      <div className="relative h-48">
        <img 
          src={challenge.imageUrl} 
          alt={challenge.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            challenge.isActive 
              ? 'bg-green-100 text-green-800' 
              : new Date(challenge.startDate) > new Date()
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {challenge.isActive 
              ? 'Active Challenge' 
              : new Date(challenge.startDate) > new Date()
              ? 'Upcoming'
              : 'Completed'}
          </div>
        </div>
        
        {/* Challenge Info */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-xl mb-1">{challenge.name}</h3>
          <div className="flex items-center space-x-3 text-white/90 text-xs">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              <span>{challenge.participants} participants</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Challenge Details */}
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>
        
        {/* Challenge Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Clock className="w-4 h-4 mx-auto mb-1 text-purple-600" />
            <p className="text-xs text-gray-500">Time Left</p>
            <p className="text-sm font-semibold text-gray-900">{challenge.daysLeft} days</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Users className="w-4 h-4 mx-auto mb-1 text-purple-600" />
            <p className="text-xs text-gray-500">Participants</p>
            <p className="text-sm font-semibold text-gray-900">{challenge.participants}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Award className="w-4 h-4 mx-auto mb-1 text-purple-600" />
            <p className="text-xs text-gray-500">Entries</p>
            <p className="text-sm font-semibold text-gray-900">{challenge.entries}</p>
          </div>
        </div>
        
        {/* Prizes */}
        {challenge.prizes && challenge.prizes.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 flex items-center mb-2">
              <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
              Prizes
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 pl-6 list-disc">
              {challenge.prizes.map((prize, index) => (
                <li key={index}>{prize.name}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex space-x-3">
          {challenge.isJoined ? (
            <button 
              onClick={handleViewChallenge}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <span>View Challenge</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <button
                onClick={onJoin}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <span>Join Challenge</span>
              </button>
              <button 
                onClick={handleViewChallenge}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Details
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StyleChallengeCard;
