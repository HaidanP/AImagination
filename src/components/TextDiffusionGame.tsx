import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Target, Eye, Waves, BookOpen } from 'lucide-react';

const TextDiffusionGame: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameProgress, setGameProgress] = useState({
    level1Complete: false,
    level2Complete: false,
    level3Complete: false,
    level4Complete: false,
    level5Complete: false,
    level6Complete: false,
    patternScore: 0,
    attentionScore: 0,
  });
  const [diffusionStep, setDiffusionStep] = useState(0);
  const [storyText, setStoryText] = useState('');

  const levels = [
    { id: 0, title: 'Welcome', icon: '🚀' },
    { id: 1, title: 'What Are Words?', icon: '🔤' },
    { id: 2, title: 'The Magic Recipe', icon: '🔢' },
    { id: 3, title: 'The Pattern Detective', icon: '🕵️' },
    { id: 4, title: 'The Attention Spotlight', icon: '💡' },
    { id: 5, title: 'The Diffusion Dance', icon: '🌊' },
    { id: 6, title: 'Build Your Own Story', icon: '📚' },
    { id: 7, title: 'Completion', icon: '🎉' }
  ];

  const startGame = () => {
    setCurrentLevel(1);
  };

  const nextLevel = (level: number) => {
    setCurrentLevel(level);
  };

  const completeGame = () => {
    setCurrentLevel(7);
  };

  const restartGame = () => {
    setCurrentLevel(0);
    setGameProgress({
      level1Complete: false,
      level2Complete: false,
      level3Complete: false,
      level4Complete: false,
      level5Complete: false,
      level6Complete: false,
      patternScore: 0,
      attentionScore: 0,
    });
    setDiffusionStep(0);
    setStoryText('');
  };

  // Word Bank Activity
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, word: string) => {
    e.dataTransfer.setData('text/plain', word);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    e.preventDefault();
    const word = e.dataTransfer.getData('text/plain');
    if (word) {
      const dropZone = e.currentTarget as HTMLElement;
      dropZone.textContent = word;
      dropZone.classList.add('filled');
      dropZone.setAttribute('data-word', word);
      
      // Add animation
      dropZone.style.transform = 'scale(1.1)';
      setTimeout(() => {
        dropZone.style.transform = 'scale(1)';
      }, 200);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Sentence checking function
  const checkSentence = () => {
    const dropZones = document.querySelectorAll('.drop-zone');
    const sentence: string[] = [];
    let filledCount = 0;
    
    dropZones.forEach((zone) => {
      const word = zone.getAttribute('data-word');
      if (word) {
        sentence.push(word);
        filledCount++;
      }
    });
    
    const checkBtn = document.querySelector('.check-btn') as HTMLButtonElement;
    
    if (!checkBtn) return;
    
    if (filledCount === 0) {
      // No words placed
      checkBtn.innerHTML = '❌ Please drag some words first!';
      checkBtn.style.background = 'linear-gradient(45deg, #EF4444, #DC2626)';
      checkBtn.style.color = 'white';
      setTimeout(() => {
        checkBtn.innerHTML = 'Check My Sentence!';
        checkBtn.style.background = 'linear-gradient(45deg, #4F46E5, #7C3AED)';
      }, 2000);
      return;
    }
    
    if (filledCount < 3) {
      // Not enough words
      checkBtn.innerHTML = `❌ Add ${3 - filledCount} more words to make a sentence!`;
      checkBtn.style.background = 'linear-gradient(45deg, #F59E0B, #EF4444)';
      checkBtn.style.color = 'white';
      setTimeout(() => {
        checkBtn.innerHTML = 'Check My Sentence!';
        checkBtn.style.background = 'linear-gradient(45deg, #4F46E5, #7C3AED)';
      }, 2500);
      return;
    }
    
    // Check for basic sentence structure
    const hasArticle = sentence.some(word => ['The', 'A', 'An'].includes(word));
    const hasNoun = sentence.some(word => ['cat', 'dog'].includes(word));
    const hasVerb = sentence.some(word => ['runs', 'walks', 'jumps'].includes(word));
    
    if (hasArticle && hasNoun && hasVerb) {
      // Perfect sentence!
      checkBtn.innerHTML = '🎉 Perfect! That\'s a great sentence!';
      checkBtn.style.background = 'linear-gradient(45deg, #10B981, #059669)';
      checkBtn.style.color = 'white';
      setGameProgress(prev => ({ ...prev, level1Complete: true }));
      
      // Add celebration animation
      dropZones.forEach((zone, index) => {
        setTimeout(() => {
          if (zone.getAttribute('data-word')) {
            zone.classList.add('success');
          }
        }, index * 200);
      });
      
    } else if (filledCount >= 3) {
      // Good attempt but could be better
      checkBtn.innerHTML = '👍 Good try! That makes sense!';
      checkBtn.style.background = 'linear-gradient(45deg, #10B981, #059669)';
      checkBtn.style.color = 'white';
      setGameProgress(prev => ({ ...prev, level1Complete: true }));
      
      dropZones.forEach((zone) => {
        if (zone.getAttribute('data-word')) {
          zone.classList.add('success');
        }
      });
    }
  };

  // Token Transformation
  const transformWord = (word: string) => {
    const tokens = word.split('').map((char, index) => 
      Math.floor(Math.random() * 1000) + index * 100
    );
    return tokens;
  };

  // Pattern Game
  const patterns = [
    { question: "The sun rises in the ____", options: ["east", "west", "north"], correct: "east" },
    { question: "Fish live in ____", options: ["water", "trees", "sky"], correct: "water" },
    { question: "Books are for ____", options: ["eating", "reading", "flying"], correct: "reading" }
  ];

  // Diffusion Animation
  const diffusionSteps = [
    "@#$%^&*()_+",
    "Th# c@t r*ns",
    "The cat runs",
    "The cat runs fast"
  ];

  const playDiffusion = () => {
    let step = 0;
    setDiffusionStep(0);
    
    const interval = setInterval(() => {
      setDiffusionStep(step);
      step++;
      if (step >= diffusionSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setGameProgress(prev => ({ ...prev, level5Complete: true }));
          // Show completion message
          const btn = document.querySelector('.play-btn');
          if (btn) {
            btn.textContent = '✅ Diffusion Complete!';
            btn.classList.add('success');
          }
        }, 1000);
      }
    }, 1500);
  };

  // Story Generator
  const generateStory = (prompt: string, creativity: number, length: number) => {
    const storyTemplates = [
      "Once upon a time, there was a magical robot who loved to help children learn about AI. It could transform any word into sparkling numbers and create amazing stories from thin air!",
      "In a digital world far away, words danced and played together in harmony. Each word had its own special number code, and together they created the most beautiful sentences.",
      "The brave little algorithm set out on a journey to understand the mysteries of language. Along the way, it discovered the secret of attention and learned to focus on the most important words.",
      "Deep in the computer's memory, tokens sparkled like stars in the night sky. Through the magic of diffusion, chaos slowly transformed into perfect, meaningful text."
    ];
    
    // Show loading animation
    setStoryText("🤖 AI is thinking...");
    
    setTimeout(() => {
      const randomStory = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
      setStoryText(randomStory);
      
      setTimeout(() => {
        setGameProgress(prev => ({ ...prev, level6Complete: true }));
      }, 1000);
    }, 2000);
  };

  const WelcomeScreen = () => (
    <div className="screen welcome-screen active">
      <div className="welcome-content">
        <h1 className="game-title">Text Diffusion Adventure</h1>
        <p className="game-subtitle">Discover how AI creates amazing text!</p>
        <div className="character-container">
          <div className="ai-character">
            <div className="character-face">
              <Brain className="brain-icon" size={60} />
            </div>
            <div className="speech-bubble">Hi! I'm Diffi, your AI guide!</div>
          </div>
        </div>
        <button className="start-btn" onClick={startGame}>
          <Sparkles className="btn-icon" />
          Start Adventure!
        </button>
        <div className="floating-words">
          <span className="floating-word" style={{ animationDelay: '0s' }}>Hello</span>
          <span className="floating-word" style={{ animationDelay: '1s' }}>World</span>
          <span className="floating-word" style={{ animationDelay: '2s' }}>AI</span>
          <span className="floating-word" style={{ animationDelay: '3s' }}>Magic</span>
        </div>
      </div>
    </div>
  );

  const Level1Screen = () => (
    <div className="screen level-screen">
      <div className="level-header">
        <h2>Level 1: What Are Words?</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '16.67%' }}></div>
        </div>
      </div>
      
      <div className="level-content">
        <div className="explanation-box">
          <p>Words are the building blocks of language! Let's explore how they work together.</p>
        </div>
        
        <div className="activity-container">
          <h3>Activity: Build a Sentence!</h3>
          <div className="word-bank">
            {['The', 'cat', 'runs', 'fast', 'quickly', 'dog'].map((word, index) => (
              <div 
                key={index}
                className="word-token" 
                draggable="true"
                onDragStart={(e) => handleDragStart(e, word)}
              >
                {word}
              </div>
            ))}
          </div>
          
          <div className="sentence-builder">
            {[0, 1, 2, 3].map((position) => (
              <div 
                key={position}
                className="drop-zone"
                onDrop={(e) => handleDrop(e, position)}
                onDragOver={handleDragOver}
              >
                Drop word here
              </div>
            ))}
          </div>
          
          <button 
            className="check-btn"
            onClick={() => {
              checkSentence();
            }}
          >
            Check My Sentence!
          </button>
        </div>
        
        {gameProgress.level1Complete && (
          <button className="next-btn" onClick={() => nextLevel(2)}>
            Next Level! 🚀
          </button>
        )}
      </div>
    </div>
  );

  const Level2Screen = () => (
    <div className="screen level-screen">
      <div className="level-header">
        <h2>Level 2: The Magic Recipe</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '33.33%' }}></div>
        </div>
      </div>
      
      <div className="level-content">
        <div className="explanation-box">
          <p>Computers turn words into special numbers called <strong>tokens</strong>! Watch the magic happen!</p>
        </div>
        
        <div className="activity-container">
          <h3>Activity: Word to Numbers Magic!</h3>
          <div className="transformation-demo">
            <div className="input-section">
              <input 
                type="text" 
                placeholder="Type a word..." 
                maxLength={20}
                id="word-input"
              />
              <button 
                onClick={() => {
                  const input = document.getElementById('word-input') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    const tokens = transformWord(input.value);
                    const output = document.getElementById('token-output');
                    if (output) {
                      output.innerHTML = tokens.map((token, index) => 
                        `<span class="token" style="animation-delay: ${index * 0.1}s">${token}</span>`
                      ).join('');
                    }
                    setTimeout(() => {
                      setGameProgress(prev => ({ ...prev, level2Complete: true }));
                    }, 1000);
                  } else {
                    // Show error for empty input
                    const btn = e.currentTarget;
                    btn.textContent = 'Please type a word first!';
                    btn.classList.add('error');
                    setTimeout(() => {
                      btn.innerHTML = '<span>✨</span> Transform!';
                      btn.classList.remove('error');
                    }, 2000);
                  }
                }}
              >
                <Sparkles size={16} />
                Transform!
              </button>
            </div>
            
            <div className="transformation-arrow">➡️</div>
            
            <div className="token-output" id="token-output">
              <div className="token-placeholder">Numbers will appear here!</div>
            </div>
          </div>
          
          <div className="token-explanation">
            <p><strong>Tokens</strong> are like a secret code that computers use to understand words!</p>
          </div>
        </div>
        
        {gameProgress.level2Complete && (
          <button className="next-btn" onClick={() => nextLevel(3)}>
            Next Level! 🚀
          </button>
        )}
      </div>
    </div>
  );

  const Level3Screen = () => {
    const [currentPattern, setCurrentPattern] = useState(0);
    const [score, setScore] = useState(0);

    const checkPattern = (answer: string) => {
      if (answer === patterns[currentPattern].correct) {
        setScore(prev => prev + 1);
        // Show success feedback
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
          if (btn.textContent === answer) {
            btn.classList.add('success');
          }
        });
        
        setTimeout(() => {
          buttons.forEach(btn => btn.classList.remove('success'));
        }, 1000);
        
        if (currentPattern < patterns.length - 1) {
          setTimeout(() => {
            setCurrentPattern(prev => prev + 1);
          }, 1500);
        } else {
          setTimeout(() => {
            setGameProgress(prev => ({ ...prev, level3Complete: true, patternScore: score + 1 }));
          }, 1500);
        }
      } else {
        // Show error feedback
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
          if (btn.textContent === answer) {
            btn.classList.add('error');
            setTimeout(() => btn.classList.remove('error'), 1000);
          }
        });
      }
    };

    return (
      <div className="screen level-screen">
        <div className="level-header">
          <h2>Level 3: The Pattern Detective</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '50%' }}></div>
          </div>
        </div>
        
        <div className="level-content">
          <div className="explanation-box">
            <p>AI models are like super detectives! They find <strong>patterns</strong> in text to predict what comes next.</p>
          </div>
          
          <div className="activity-container">
            <h3>Activity: Complete the Pattern!</h3>
            <div className="pattern-game">
              <div className="pattern-question">
                <p>{patterns[currentPattern].question}</p>
                <div className="options">
                  {patterns[currentPattern].options.map((option, index) => (
                    <button 
                      key={index}
                      className="option-btn"
                      onClick={() => checkPattern(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="score-display">
              <Target className="score-icon" />
              <span>Score: {score}/{patterns.length}</span>
            </div>
          </div>
          
          {gameProgress.level3Complete && (
            <button className="next-btn" onClick={() => nextLevel(4)}>
              Next Level! 🚀
            </button>
          )}
        </div>
      </div>
    );
  };

  const Level4Screen = () => {
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const sentence = ['The', 'red', 'car', 'drives', 'fast'];

    const toggleWord = (word: string) => {
      setSelectedWords(prev => 
        prev.includes(word) 
          ? prev.filter(w => w !== word)
          : [...prev, word]
      );
    };

    const checkAttention = () => {
      const correctWords = ['red', 'car', 'drives', 'fast'];
      const correctCount = correctWords.filter(word => selectedWords.includes(word)).length;
      
      if (correctCount >= 3) {
        setGameProgress(prev => ({ ...prev, level4Complete: true }));
        // Show success message
        const btn = document.querySelector('.check-btn');
        if (btn) {
          btn.textContent = '✅ Perfect! You found the important words!';
          btn.classList.add('success');
        }
      } else {
        // Show hint
        const btn = document.querySelector('.check-btn');
        if (btn) {
          btn.textContent = `Good! Try finding ${4 - correctCount} more important words.`;
          btn.classList.add('error');
          setTimeout(() => {
            btn.textContent = 'Check Attention!';
            btn.classList.remove('error');
          }, 3000);
        }
      }
    };

    return (
      <div className="screen level-screen">
        <div className="level-header">
          <h2>Level 4: The Attention Spotlight</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '66.67%' }}></div>
          </div>
        </div>
        
        <div className="level-content">
          <div className="explanation-box">
            <p>AI uses <strong>attention</strong> to focus on important words, just like a spotlight on a stage!</p>
          </div>
          
          <div className="activity-container">
            <h3>Activity: Shine the Spotlight!</h3>
            <div className="attention-demo">
              <div className="sentence-display">
                {sentence.map((word, index) => (
                  <span 
                    key={index}
                    className={`word ${selectedWords.includes(word) ? 'highlighted' : ''}`}
                    onClick={() => toggleWord(word)}
                  >
                    {word}
                  </span>
                ))}
              </div>
              
              <div className="attention-question">
                <Eye className="question-icon" />
                <p>Which words are most important to understand "What is driving fast?"</p>
                <p className="instruction">Click on words to highlight them!</p>
              </div>
              
              <button onClick={checkAttention} className="check-btn">
                Check Attention!
              </button>
            </div>
          </div>
          
          {gameProgress.level4Complete && (
            <button className="next-btn" onClick={() => nextLevel(5)}>
              Next Level! 🚀
            </button>
          )}
        </div>
      </div>
    );
  };

  const Level5Screen = () => (
    <div className="screen level-screen">
      <div className="level-header">
        <h2>Level 5: The Diffusion Dance</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '83.33%' }}></div>
        </div>
      </div>
      
      <div className="level-content">
        <div className="explanation-box">
          <p><strong>Diffusion</strong> is how AI creates text step by step, like a magic dance from chaos to perfect words!</p>
        </div>
        
        <div className="activity-container">
          <h3>Activity: Watch the Diffusion Magic!</h3>
          <div className="diffusion-demo">
            <div className="diffusion-steps">
              {diffusionSteps.map((step, index) => (
                <div 
                  key={index}
                  className={`step ${index <= diffusionStep ? 'active' : ''}`}
                >
                  <h4>Step {index + 1}: {
                    index === 0 ? 'Random Noise' :
                    index === 1 ? 'Finding Patterns' :
                    index === 2 ? 'Refining Words' :
                    'Perfect Text!'
                  }</h4>
                  <div className="text-display">{step}</div>
                </div>
              ))}
            </div>
            
            <div className="diffusion-controls">
              <button onClick={playDiffusion} className="play-btn">
                <Waves className="btn-icon" />
                Play Diffusion
              </button>
              <button 
                onClick={() => setDiffusionStep(0)} 
                className="reset-btn"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>
        
        {gameProgress.level5Complete && (
          <button className="next-btn" onClick={() => nextLevel(6)}>
            Final Level! 🏆
          </button>
        )}
      </div>
    </div>
  );

  const Level6Screen = () => {
    const [creativity, setCreativity] = useState(3);
    const [length, setLength] = useState(3);

    return (
      <div className="screen level-screen">
        <div className="level-header">
          <h2>Level 6: Build Your Own Story</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '100%' }}></div>
          </div>
        </div>
        
        <div className="level-content">
          <div className="explanation-box">
            <p>Now you're an AI expert! Create your own stories using everything you've learned!</p>
          </div>
          
          <div className="activity-container">
            <h3>Activity: AI Story Generator!</h3>
            <div className="story-generator">
              <div className="story-controls">
                <input 
                  type="text" 
                  placeholder="Start your story... (e.g., 'Once upon a time')" 
                  maxLength={50}
                  id="story-prompt"
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('story-prompt') as HTMLInputElement;
                    generateStory(input.value, creativity, length);
                  }}
                  className="generate-btn"
                >
                  <BookOpen className="btn-icon" />
                  Generate Story!
                </button>
              </div>
              
              <div className="story-output">
                {storyText ? (
                  <p>{storyText}</p>
                ) : (
                  <p className="placeholder">Your AI-generated story will appear here!</p>
                )}
              </div>
              
              <div className="parameters-panel">
                <h4>Adjust AI Settings:</h4>
                <div className="parameter">
                  <label>Creativity Level: {creativity}</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={creativity}
                    onChange={(e) => setCreativity(Number(e.target.value))}
                  />
                </div>
                <div className="parameter">
                  <label>Story Length: {length}</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {gameProgress.level6Complete && (
            <button className="next-btn" onClick={completeGame}>
              Complete Adventure! 🎉
            </button>
          )}
        </div>
      </div>
    );
  };

  const CompletionScreen = () => (
    <div className="screen completion-screen">
      <div className="completion-content">
        <h1>🎉 Congratulations! 🎉</h1>
        <p className="completion-text">You've mastered the art of text diffusion!</p>
        
        <div className="badges-container">
          <div className="badge">
            <div className="badge-icon">🔤</div>
            <div className="badge-text">Word Master</div>
          </div>
          <div className="badge">
            <div className="badge-icon">🔢</div>
            <div className="badge-text">Token Expert</div>
          </div>
          <div className="badge">
            <div className="badge-icon">🕵️</div>
            <div className="badge-text">Pattern Detective</div>
          </div>
          <div className="badge">
            <div className="badge-icon">💡</div>
            <div className="badge-text">Attention Master</div>
          </div>
          <div className="badge">
            <div className="badge-icon">🌊</div>
            <div className="badge-text">Diffusion Dancer</div>
          </div>
          <div className="badge">
            <div className="badge-icon">📚</div>
            <div className="badge-text">Story Creator</div>
          </div>
        </div>
        
        <div className="learned-terms">
          <h3>Terms You've Mastered:</h3>
          <div className="terms-grid">
            <div className="term">
              <strong>Tokens:</strong> Number codes for words
            </div>
            <div className="term">
              <strong>Patterns:</strong> Repeated structures in text
            </div>
            <div className="term">
              <strong>Attention:</strong> Focusing on important words
            </div>
            <div className="term">
              <strong>Diffusion:</strong> Step-by-step text creation
            </div>
            <div className="term">
              <strong>AI Model:</strong> Computer that learns patterns
            </div>
            <div className="term">
              <strong>Training:</strong> Teaching AI from examples
            </div>
          </div>
        </div>
        
        <button onClick={restartGame} className="restart-btn">
          Play Again! 🔄
        </button>
      </div>
    </div>
  );

  return (
    <div className="game-container">
      {currentLevel === 0 && <WelcomeScreen />}
      {currentLevel === 1 && <Level1Screen />}
      {currentLevel === 2 && <Level2Screen />}
      {currentLevel === 3 && <Level3Screen />}
      {currentLevel === 4 && <Level4Screen />}
      {currentLevel === 5 && <Level5Screen />}
      {currentLevel === 6 && <Level6Screen />}
      {currentLevel === 7 && <CompletionScreen />}
    </div>
  );
};

export default TextDiffusionGame;