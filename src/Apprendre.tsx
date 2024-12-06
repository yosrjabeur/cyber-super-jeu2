import React, { useState } from 'react';  
import { useDrag, useDrop } from 'react-dnd';
import artebloquer from '../src/asset/artebloquer.png';
import barriere from '../src/asset/dam-water-barrier.gif';
import carre from '../src/asset/carre.png'
import simunitaire from '../src/asset/siimunitaire.png'

const categories = [
  { id: 1, name: 'Glissez le rond ici' },
  { id: 2, name: 'Glissez le carré ici' },
];

const cardsData = [
  { id: 1, text: 'un', category: 'Glissez le rond ici'},
  { id: 2, text: 'deux', category: 'Glissez le carré ici' },
];

const explanations: Record<string, string> = {
    'Glissez le carré ici': "Bravo! Vous avez réparer la couche d'ozone",
    'Glissez le rond ici': "Bravo! Vous avez réparer la couche d'ozone",
   };

const Apprendre: React.FC = () => {
  const [cards, setCards] = useState(cardsData);
  const [score, setScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [popupType, setPopupType] = useState<'correct' | 'incorrect'>('correct');
  const [explanation, setExplanation] = useState('');

  const handleDrop = (cardId: number, targetCategory: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (card && card.category === targetCategory) {
      setCards((prevCards) => prevCards.filter((c) => c.id !== cardId));
      setScore((prevScore) => prevScore + 1);
      setMessage('Bonne réponse !');
      setPopupType('correct');
      setExplanation(explanations[targetCategory]); // Affichage de l'explication
    } else {
      setMessage('Mauvaise réponse, essayez encore.');
      setPopupType('incorrect');
      setExplanation('Il semble que vous ayez fait une erreur. Réessayez pour mieux comprendre !');
    }
    setShowPopup(true);
  };

  const DraggableCard = ({ id, text }: { id: number; text: string;  }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'card',
      item: { id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag}
        className={`bg-[#d9d9d9] bg-opacity-70 p-4 shadow-lg w-48 h-48 text-center flex flex-col items-center justify-between border border-gray-300 ${
          text === "un" ? 'rounded-full' : 'rounded-xl'
        }`} 
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
      </div>
    );
  };

  const DropZone = ({ name }: { name: string }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: 'card',
      drop: (item: { id: number }) => handleDrop(item.id, name),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }));

    return (
      <div
        ref={drop}
        className={`p-4 w-60 h-60 bg-gray-200  flex items-center justify-center text-center ${isOver ? 'bg-green-200' : canDrop ? 'bg-yellow-200' : ''} ${
          name === "Glissez le rond ici" ? 'rounded-full' : 'rounded-xl'
        }`} // Applique 'rounded-full' pour la première catégorie
      >
        <p className="text-xl font-semibold">{categories.find((category) => category.name === name)?.name}</p>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        backgroundImage: `url(${require('../src/asset/background.png')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        margin: 0,
        padding: 0,
      }}
    >
    <header className="text-center mb-12 bg-black bg-opacity-50 p-4 rounded-md mt-8 h-[60px]">
    <p className="text-lg text-gray-200">Faites glisser les éléments vers les bonnes places !</p>
    </header>

    <div className="flex flex-row gap-6 w-full mb-12">
  {/* Première div pour les cartes */}
  <div className="flex flex-col gap-6 items-end mr-[425px]  ">
    {cards.map((card) => (
      <DraggableCard key={card.id} id={card.id} text={card.text} />
    ))}
  </div>

  {/* Deuxième div pour les zones de dépôt */}
  <div className="flex flex-col gap-[250px] items-center" >
  {categories.map((category) => (
    <DropZone key={category.id} name={category.name} />
  ))}
</div>

</div>


      {showPopup && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6  text-xl max-w-xl w-full overflow-y-auto ${
            popupType === 'correct' ? 'bg-green-600' : 'bg-red-600'
          }`}
          style={{
            color: 'white', 
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
          onClick={() => setShowPopup(false)} // Fermeture du popup au clic
        >
          <div className="space-y-4">
            <p className="font-semibold">{message}</p>
            <p>{explanation}</p> {/* Affichage de l'explication */}
            <button
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out"
              onClick={() => setShowPopup(false)} // Fermeture au clic sur le bouton
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <footer className="mt-12 text-center text-lg bg-black bg-opacity-50 text-white p-4 rounded-md">
        <p>Votre Score : {score} / {cardsData.length}</p>
      </footer>
    </div>
  );
};

export default Apprendre;
