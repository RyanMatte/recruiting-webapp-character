import { useReducer, useState, useEffect } from 'react';
import './App.css';
import { CLASS_LIST, INITIAL_USER_STATE } from './consts.js';
import CharacterModal from './components/ClassModal.jsx'
import Skills from './components/Skill.jsx';
import Attributes from './components/Attribute.jsx';

function getAttributeCount(user) {
  let attribute_total = 0 
  Object.values(user.attributes).forEach((value) => {
    attribute_total = attribute_total + value
  })

  return attribute_total
}

function reducer(characterSheet, action) {
  switch (action.type) {
    case "attribute_increment":
      return characterSheet.map(user => {
        if (getAttributeCount(user) >= 70) {
          alert("You have maxed out your attributes please lower them")
          return user;
        }
        if (user.user_id === action.id) {
          return {
            ...user,
            attributes: {
              ...user.attributes,
              [action.attribute]: user.attributes[action.attribute] + 1
            }
          };
        }
        return user;
      });
    case "attribute_decrement":
      return characterSheet.map(user => {
        if (user.user_id === action.id) {
          return {
            ...user,
            attributes: {
              ...user.attributes,
              [action.attribute]: user.attributes[action.attribute] - 1
            }
          };
        }
        return user;
      });
      case "skill_increment":
        return characterSheet.map(user => {
          if (user.skill_points === 0) {
            alert("You are out of skill points. Please remove some")
            return user;
          }
          if (user.user_id === action.id) {
            return {
              ...user,
              skills: {
                ...user.skills,
                [action.skill]: user.skills[action.skill] + 1
              },
              skill_points: user.skill_points - 1
            };
          }
          return user;
        });
      case "skill_decrement":
        return characterSheet.map(user => {
          if (user.user_id === action.id) {
            return {
              ...user,
              skills: {
                ...user.skills,
                [action.skill]: user.skills[action.skill] - 1
              },
              skill_points: user.skill_points + 1
            };
          }
          return user;
        });
      case "add_character":
        const newId = characterSheet.length > 0 ? characterSheet[characterSheet.length - 1].user_id + 1 : 1;
        const newCharacter = {...INITIAL_USER_STATE, user_id: newId}
        return [...characterSheet, newCharacter];
      case "set_initial_state":
        if (action.data.message === 'Item not found') {
          return [INITIAL_USER_STATE]
        }
        return action.data;
    default:
      return characterSheet;
  }
}

function App() {
  const [characterSheet, dispatch] = useReducer(reducer, [INITIAL_USER_STATE]);
  const [isOpen, setIsOpen] = useState(false);


  // Couldn't get this working in time, the idea would be to fetch our user data and set it when we render
  useEffect(() => {
    fetch('https://recruiting.verylongdomaintotestwith.ca/api/RyanMatte/character', {method: 'GET'})
      .then(response => response.json())
      .then(data => {
        console.log(data)
        dispatch({type: "set_initial_state", data})
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [])


  // save state returns successfully but unfortunately not working
  const saveState = () => {
    fetch('https://recruiting.verylongdomaintotestwith.ca/api/RyanMatte/character', {method: 'POST', body: JSON.stringify(characterSheet)})
    .then(response => {
      if (response.ok) {
        alert('Character Sheet saved successfully!');
      } else {
        alert('Failed to save character sheet.');
      }
    })
    .catch(error => {
      console.error('Error saving Character Sheet:', error);
      alert('Error saving Character Sheet.');
    });

  }

  const handleAttributeUpdate = (id, attribute, type) => {
    dispatch({
      type,
      id,
      attribute
    })
  }

  const handleSkillUpdate = (id, skill, type) => {
    dispatch({
      type,
      id,
      skill
    })
  }

  const handleNewCharacter = (type) => {
    dispatch({
      type
    })
  }

  const qualifiedClass = (userAttributes, classAttributes) => {
    let qualified = true
    Object.entries(userAttributes).forEach(([key, value]) => {
      if (value < classAttributes[key]) { 
        qualified = false
      }
    })
    return qualified
  }

  const getModifier = (modifierValue) => {
    return Math.floor((modifierValue - 10) / 2)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <button onClick={() => handleNewCharacter("add_character")} >Add Character</button>
      <button onClick={() => saveState()} >Save</button>
      <section className="App-section">
        {characterSheet.map((user, userIndex) => (
          <div className='sheet'>
            <Attributes
              user={user}
              handleAttributeUpdate={handleAttributeUpdate}
              getModifier={getModifier}
            />
            <div>
              {Object.keys(CLASS_LIST).map((className, index) => (
                <div
                  key={index}
                  className={qualifiedClass(user.attributes, CLASS_LIST[className]) ? '' : 'qualified-class'}
                >
                  {isOpen && (
                    <CharacterModal
                    />
                  )}
                  {className}
                </div>
              ))}
            </div>
            <Skills
              user={user}
              handleSkillUpdate={handleSkillUpdate}
              getModifier={getModifier}
            />
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
