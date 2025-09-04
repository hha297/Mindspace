import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Question {
        id: string;
        question: string;
        options: { value: number; label: string }[];
}

export interface Quiz {
        id: string;
        title: string;
        description: string;
        questions: Question[];
        scoring: {
                ranges: {
                        min: number;
                        max: number;
                        level: string;
                        description: string;
                        color: string;
                        icon: LucideIcon;
                }[];
        };
}

// Pool of 50 stress assessment questions
export const STRESS_QUESTIONS: Question[] = [
        {
                id: 'q1',
                question: 'How often have you felt nervous or stressed in the past week?',
                options: [
                        { value: 0, label: 'Never' },
                        { value: 1, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 3, label: 'Fairly often' },
                        { value: 4, label: 'Very often' },
                ],
        },
        {
                id: 'q2',
                question: 'How often have you felt unable to control important things in your life?',
                options: [
                        { value: 0, label: 'Never' },
                        { value: 1, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 3, label: 'Fairly often' },
                        { value: 4, label: 'Very often' },
                ],
        },
        {
                id: 'q3',
                question: 'How often have you felt confident about handling personal problems?',
                options: [
                        { value: 4, label: 'Never' },
                        { value: 3, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 1, label: 'Fairly often' },
                        { value: 0, label: 'Very often' },
                ],
        },
        {
                id: 'q4',
                question: 'How often have you felt that things were going your way?',
                options: [
                        { value: 4, label: 'Never' },
                        { value: 3, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 1, label: 'Fairly often' },
                        { value: 0, label: 'Very often' },
                ],
        },
        {
                id: 'q5',
                question: "How often have you felt difficulties piling up so high you couldn't overcome them?",
                options: [
                        { value: 0, label: 'Never' },
                        { value: 1, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 3, label: 'Fairly often' },
                        { value: 4, label: 'Very often' },
                ],
        },
        {
                id: 'q6',
                question: 'How often have you felt overwhelmed by your responsibilities?',
                options: [
                        { value: 0, label: 'Never' },
                        { value: 1, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 3, label: 'Fairly often' },
                        { value: 4, label: 'Very often' },
                ],
        },
        {
                id: 'q7',
                question: 'How often have you had trouble falling asleep or staying asleep?',
                options: [
                        { value: 0, label: 'Never' },
                        { value: 1, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 3, label: 'Fairly often' },
                        { value: 4, label: 'Very often' },
                ],
        },
        {
                id: 'q8',
                question: 'How often have you felt irritable or easily annoyed?',
                options: [
                        { value: 0, label: 'Never' },
                        { value: 1, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 3, label: 'Fairly often' },
                        { value: 4, label: 'Very often' },
                ],
        },
        {
                id: 'q9',
                question: 'How often have you felt physically tense or on edge?',
                options: [
                        { value: 0, label: 'Never' },
                        { value: 1, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 3, label: 'Fairly often' },
                        { value: 4, label: 'Very often' },
                ],
        },
        {
                id: 'q10',
                question: 'How often have you felt like you could not cope with all the things you had to do?',
                options: [
                        { value: 0, label: 'Never' },
                        { value: 1, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 3, label: 'Fairly often' },
                        { value: 4, label: 'Very often' },
                ],
        },
        {
                id: 'q11',
                question: 'How often have you felt that you were not able to control the important things in your life?',
                options: [
                        { value: 0, label: 'Never' },
                        { value: 1, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 3, label: 'Fairly often' },
                        { value: 4, label: 'Very often' },
                ],
        },
        {
                id: 'q12',
                question: 'How often have you felt that problems were accumulating and you could not overcome them?',
                options: [
                        { value: 0, label: 'Never' },
                        { value: 1, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 3, label: 'Fairly often' },
                        { value: 4, label: 'Very often' },
                ],
        },
        {
                id: 'q13',
                question: 'How often have you felt that you were on top of things?',
                options: [
                        { value: 4, label: 'Never' },
                        { value: 3, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 1, label: 'Fairly often' },
                        { value: 0, label: 'Very often' },
                ],
        },
        {
                id: 'q14',
                question: 'How often have you felt angry because of things that were outside of your control?',
                options: [
                        { value: 0, label: 'Never' },
                        { value: 1, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 3, label: 'Fairly often' },
                        { value: 4, label: 'Very often' },
                ],
        },
        {
                id: 'q15',
                question: 'How often have you felt difficulties were piling up so high that you could not overcome them?',
                options: [
                        { value: 0, label: 'Never' },
                        { value: 1, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 3, label: 'Fairly often' },
                        { value: 4, label: 'Very often' },
                ],
        },
        {
                id: 'q16',
                question: 'How often have you felt that you were not able to control the important things in your life?',
                options: [
                        { value: 0, label: 'Never' },
                        { value: 1, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 3, label: 'Fairly often' },
                        { value: 4, label: 'Very often' },
                ],
        },
        {
                id: 'q17',
                question: 'How often have you felt confident about your ability to handle your personal problems?',
                options: [
                        { value: 4, label: 'Never' },
                        { value: 3, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 1, label: 'Fairly often' },
                        { value: 0, label: 'Very often' },
                ],
        },
        {
                id: 'q18',
                question: 'How often have you felt that things were going your way?',
                options: [
                        { value: 4, label: 'Never' },
                        { value: 3, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 1, label: 'Fairly often' },
                        { value: 0, label: 'Very often' },
                ],
        },
        {
                id: 'q19',
                question: 'How often have you felt that you were effectively coping with important changes that were occurring in your life?',
                options: [
                        { value: 4, label: 'Never' },
                        { value: 3, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 1, label: 'Fairly often' },
                        { value: 0, label: 'Very often' },
                ],
        },
        {
                id: 'q20',
                question: 'How often have you felt that you were able to control irritations in your life?',
                options: [
                        { value: 4, label: 'Never' },
                        { value: 3, label: 'Almost never' },
                        { value: 2, label: 'Sometimes' },
                        { value: 1, label: 'Fairly often' },
                        { value: 0, label: 'Very often' },
                ],
        },
        // New questions with diverse formats
        {
                id: 'q21',
                question: 'What is your primary source of stress right now?',
                options: [
                        { value: 0, label: 'No significant stress' },
                        { value: 1, label: 'Work or academic pressure' },
                        { value: 2, label: 'Personal relationships' },
                        { value: 3, label: 'Financial concerns' },
                        { value: 4, label: 'Health issues' },
                ],
        },
        {
                id: 'q22',
                question: 'When do you feel most stressed during the day?',
                options: [
                        { value: 0, label: 'I rarely feel stressed' },
                        { value: 1, label: 'Early morning' },
                        { value: 2, label: 'Midday' },
                        { value: 3, label: 'Late afternoon' },
                        { value: 4, label: 'Evening or night' },
                ],
        },
        {
                id: 'q23',
                question: 'How do you typically respond to stressful situations?',
                options: [
                        { value: 0, label: 'I handle them calmly' },
                        { value: 1, label: 'I take time to think' },
                        { value: 2, label: 'I get slightly anxious' },
                        { value: 3, label: 'I become overwhelmed' },
                        { value: 4, label: 'I panic or freeze' },
                ],
        },
        {
                id: 'q24',
                question: 'What physical symptoms do you experience when stressed?',
                options: [
                        { value: 0, label: 'None' },
                        { value: 1, label: 'Slight tension' },
                        { value: 2, label: 'Headaches or muscle tension' },
                        { value: 3, label: 'Digestive issues' },
                        { value: 4, label: 'Multiple physical symptoms' },
                ],
        },
        {
                id: 'q25',
                question: 'When was the last time you felt completely relaxed?',
                options: [
                        { value: 0, label: 'Today' },
                        { value: 1, label: 'This week' },
                        { value: 2, label: 'This month' },
                        { value: 3, label: 'A few months ago' },
                        { value: 4, label: 'I cannot remember' },
                ],
        },
        {
                id: 'q26',
                question: 'How well do you sleep when under stress?',
                options: [
                        { value: 0, label: 'I sleep well' },
                        { value: 1, label: 'Slightly disturbed' },
                        { value: 2, label: 'Moderate sleep issues' },
                        { value: 3, label: 'Significant sleep problems' },
                        { value: 4, label: 'Severe insomnia' },
                ],
        },
        {
                id: 'q27',
                question: 'What coping mechanisms do you use when stressed?',
                options: [
                        { value: 0, label: 'Healthy strategies' },
                        { value: 1, label: 'Exercise or meditation' },
                        { value: 2, label: 'Talking to friends' },
                        { value: 3, label: 'Avoidance or distraction' },
                        { value: 4, label: 'Unhealthy habits' },
                ],
        },
        {
                id: 'q28',
                question: 'How does stress affect your relationships?',
                options: [
                        { value: 0, label: 'No negative impact' },
                        { value: 1, label: 'Minor irritability' },
                        { value: 2, label: 'Some withdrawal' },
                        { value: 3, label: 'Frequent conflicts' },
                        { value: 4, label: 'Severe relationship strain' },
                ],
        },
        {
                id: 'q29',
                question: 'When you feel overwhelmed, what do you do first?',
                options: [
                        { value: 0, label: 'Take a break' },
                        { value: 1, label: 'Prioritize tasks' },
                        { value: 2, label: 'Ask for help' },
                        { value: 3, label: 'Push through' },
                        { value: 4, label: 'Shut down' },
                ],
        },
        {
                id: 'q30',
                question: 'How often do you take breaks during stressful periods?',
                options: [
                        { value: 0, label: 'Regularly' },
                        { value: 1, label: 'Sometimes' },
                        { value: 2, label: 'Rarely' },
                        { value: 3, label: 'Almost never' },
                        { value: 4, label: 'Never' },
                ],
        },
        {
                id: 'q31',
                question: 'What would help you manage stress better?',
                options: [
                        { value: 0, label: 'I already manage well' },
                        { value: 1, label: 'Better time management' },
                        { value: 2, label: 'More support from others' },
                        { value: 3, label: 'Professional help' },
                        { value: 4, label: 'Major life changes' },
                ],
        },
        {
                id: 'q32',
                question: 'How does stress impact your concentration?',
                options: [
                        { value: 0, label: 'No impact' },
                        { value: 1, label: 'Slight difficulty' },
                        { value: 2, label: 'Moderate problems' },
                        { value: 3, label: 'Significant impairment' },
                        { value: 4, label: 'Severe concentration issues' },
                ],
        },
        {
                id: 'q33',
                question: 'When stressed, how do you treat yourself?',
                options: [
                        { value: 0, label: 'With kindness' },
                        { value: 1, label: 'Neutrally' },
                        { value: 2, label: 'With some criticism' },
                        { value: 3, label: 'Harshly' },
                        { value: 4, label: 'Very harshly' },
                ],
        },
        {
                id: 'q34',
                question: 'What triggers your stress most frequently?',
                options: [
                        { value: 0, label: 'Nothing specific' },
                        { value: 1, label: 'Deadlines' },
                        { value: 2, label: 'Social situations' },
                        { value: 3, label: 'Uncertainty' },
                        { value: 4, label: 'Multiple triggers' },
                ],
        },
        {
                id: 'q35',
                question: 'How do you feel about your ability to handle future stress?',
                options: [
                        { value: 0, label: 'Very confident' },
                        { value: 1, label: 'Somewhat confident' },
                        { value: 2, label: 'Neutral' },
                        { value: 3, label: 'Somewhat worried' },
                        { value: 4, label: 'Very worried' },
                ],
        },
        {
                id: 'q36',
                question: 'What is your stress level compared to last month?',
                options: [
                        { value: 0, label: 'Much lower' },
                        { value: 1, label: 'Slightly lower' },
                        { value: 2, label: 'About the same' },
                        { value: 3, label: 'Slightly higher' },
                        { value: 4, label: 'Much higher' },
                ],
        },
        {
                id: 'q37',
                question: 'How often do you feel like you need a break from everything?',
                options: [
                        { value: 0, label: 'Never' },
                        { value: 1, label: 'Rarely' },
                        { value: 2, label: 'Sometimes' },
                        { value: 3, label: 'Often' },
                        { value: 4, label: 'Constantly' },
                ],
        },
        {
                id: 'q38',
                question: 'What happens to your energy levels when you are stressed?',
                options: [
                        { value: 0, label: 'They stay normal' },
                        { value: 1, label: 'Slight decrease' },
                        { value: 2, label: 'Moderate decrease' },
                        { value: 3, label: 'Significant decrease' },
                        { value: 4, label: 'Complete exhaustion' },
                ],
        },
        {
                id: 'q39',
                question: 'How do you prioritize self-care when stressed?',
                options: [
                        { value: 0, label: 'It is a priority' },
                        { value: 1, label: 'I try to maintain it' },
                        { value: 2, label: 'Sometimes I remember' },
                        { value: 3, label: 'I often forget' },
                        { value: 4, label: 'I completely neglect it' },
                ],
        },
        {
                id: 'q40',
                question: 'What is your biggest worry right now?',
                options: [
                        { value: 0, label: 'No major worries' },
                        { value: 1, label: 'Minor concerns' },
                        { value: 2, label: 'Moderate worries' },
                        { value: 3, label: 'Significant concerns' },
                        { value: 4, label: 'Major life worries' },
                ],
        },
        {
                id: 'q41',
                question: 'How do you communicate when you are stressed?',
                options: [
                        { value: 0, label: 'Clearly and calmly' },
                        { value: 1, label: 'Mostly clear' },
                        { value: 2, label: 'Sometimes unclear' },
                        { value: 3, label: 'Often unclear' },
                        { value: 4, label: 'Very unclear' },
                ],
        },
        {
                id: 'q42',
                question: 'What is your stress tolerance level?',
                options: [
                        { value: 0, label: 'Very high' },
                        { value: 1, label: 'High' },
                        { value: 2, label: 'Moderate' },
                        { value: 3, label: 'Low' },
                        { value: 4, label: 'Very low' },
                ],
        },
        {
                id: 'q43',
                question: 'How do you handle unexpected changes?',
                options: [
                        { value: 0, label: 'Very well' },
                        { value: 1, label: 'Generally well' },
                        { value: 2, label: 'With some difficulty' },
                        { value: 3, label: 'With significant difficulty' },
                        { value: 4, label: 'Very poorly' },
                ],
        },
        {
                id: 'q44',
                question: 'What is your stress recovery time?',
                options: [
                        { value: 0, label: 'Immediate' },
                        { value: 1, label: 'Within hours' },
                        { value: 2, label: 'Within days' },
                        { value: 3, label: 'Within weeks' },
                        { value: 4, label: 'Takes months' },
                ],
        },
        {
                id: 'q45',
                question: 'How do you view stress in your life?',
                options: [
                        { value: 0, label: 'As a challenge to overcome' },
                        { value: 1, label: 'As manageable' },
                        { value: 2, label: 'As sometimes overwhelming' },
                        { value: 3, label: 'As a major problem' },
                        { value: 4, label: 'As unbearable' },
                ],
        },
        {
                id: 'q46',
                question: 'What is your support system like?',
                options: [
                        { value: 0, label: 'Excellent' },
                        { value: 1, label: 'Good' },
                        { value: 2, label: 'Adequate' },
                        { value: 3, label: 'Limited' },
                        { value: 4, label: 'Minimal or none' },
                ],
        },
        {
                id: 'q47',
                question: 'How do you feel about asking for help when stressed?',
                options: [
                        { value: 0, label: 'Very comfortable' },
                        { value: 1, label: 'Somewhat comfortable' },
                        { value: 2, label: 'Neutral' },
                        { value: 3, label: 'Somewhat uncomfortable' },
                        { value: 4, label: 'Very uncomfortable' },
                ],
        },
        {
                id: 'q48',
                question: 'What is your stress management knowledge?',
                options: [
                        { value: 0, label: 'Very knowledgeable' },
                        { value: 1, label: 'Somewhat knowledgeable' },
                        { value: 2, label: 'Basic knowledge' },
                        { value: 3, label: 'Limited knowledge' },
                        { value: 4, label: 'No knowledge' },
                ],
        },
        {
                id: 'q49',
                question: 'How do you balance work and personal life when stressed?',
                options: [
                        { value: 0, label: 'Very well' },
                        { value: 1, label: 'Generally well' },
                        { value: 2, label: 'With some difficulty' },
                        { value: 3, label: 'With significant difficulty' },
                        { value: 4, label: 'Very poorly' },
                ],
        },
        {
                id: 'q50',
                question: 'What is your overall stress outlook?',
                options: [
                        { value: 0, label: 'Very positive' },
                        { value: 1, label: 'Somewhat positive' },
                        { value: 2, label: 'Neutral' },
                        { value: 3, label: 'Somewhat negative' },
                        { value: 4, label: 'Very negative' },
                ],
        },
];

export const STRESS_QUIZ_CONFIG: Omit<Quiz, 'questions'> = {
        id: 'stress-assessment',
        title: 'Stress Level Assessment',
        description: 'This brief assessment can help you understand your current stress levels.',
        scoring: {
                ranges: [
                        {
                                min: 0,
                                max: 7,
                                level: 'Low Stress',
                                description:
                                        "You're managing stress well. Keep up the good work with your current coping strategies.",
                                color: 'text-green-700 bg-green-50 border-green-300',
                                icon: CheckCircle,
                        },
                        {
                                min: 8,
                                max: 13,
                                level: 'Moderate Stress',
                                description:
                                        "You're experiencing some stress. Consider incorporating stress-reduction techniques into your routine.",
                                color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
                                icon: Info,
                        },
                        {
                                min: 14,
                                max: 20,
                                level: 'High Stress',
                                description:
                                        "You're experiencing significant stress. It may be helpful to speak with a counselor or mental health professional.",
                                color: 'text-red-700 bg-red-50 border-red-200',
                                icon: AlertTriangle,
                        },
                ],
        },
};

// Function to get random questions for assessment
export function getRandomStressQuestions(count: number = 10): Question[] {
        const shuffled = [...STRESS_QUESTIONS].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
}

// Function to create a complete quiz with random questions
export function createStressQuiz(questionCount: number = 10): Quiz {
        const randomQuestions = getRandomStressQuestions(questionCount);
        return {
                ...STRESS_QUIZ_CONFIG,
                questions: randomQuestions,
        };
}
