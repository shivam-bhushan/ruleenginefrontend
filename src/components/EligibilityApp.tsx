"use client";

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, CheckCircle, XCircle } from 'lucide-react';

type Rule = {
    _id: string;
    name: string;
    expression: string;
};

export default function EligibilityApp() {
    const [inputName, setInputName] = useState('');
    const [inputExpression, setInputExpression] = useState('');
    const [inputData, setInputData] = useState<{ [key: string]: unknown }>({});
    const [rules, setRules] = useState<Rule[]>([]);
    const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);
    const [eligibility, setEligibility] = useState<string | null>(null);
    const { toast } = useToast();

    // Fetch all rules from the backend on component mount
    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/rules');
            if (response.ok) {
                const data = await response.json();
                setRules(data.rules);
            } else {
                throw new Error('Failed to fetch rules.');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
            }
        }
    };

    const addRule = async () => {
        if (inputName.trim() && inputExpression.trim()) {
            try {
                const response = await fetch('http://localhost:3000/api/rules', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: inputName.trim(),
                        expression: inputExpression.trim(),
                    }),
                });

                if (response.ok) {
                    const newRule = await response.json();
                    setRules((prevRules) => [...prevRules, newRule.rule]);
                    setInputName('');
                    setInputExpression('');
                    toast({
                        title: "Success",
                        description: "Rule added successfully.",
                    });
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast({
                        title: "Error",
                        description: error.message,
                        variant: "destructive",
                    });
                }
            }
        } else {
            toast({
                title: "Error",
                description: "Both name and expression are required.",
                variant: "destructive",
            });
        }
    };

    const deleteRule = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/rules/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setRules((prevRules) => prevRules.filter((rule) => rule._id !== id));
                toast({
                    title: "Success",
                    description: "Rule deleted successfully.",
                });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
            }
        }
    };

    const handleInputChange = (key: string, value: string) => {
        setInputData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const toggleRuleSelection = (id: string) => {
        setSelectedRuleIds((prev) =>
            prev.includes(id) ? prev.filter((ruleId) => ruleId !== id) : [...prev, id]
        );
    };

    const checkEligibility = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: inputData, ruleIds: selectedRuleIds }),
            });

            if (response.ok) {
                const result = await response.json();
                setEligibility(result.eligible ? 'Eligible' : 'Not Eligible');
            } else {
                throw new Error('Failed to check eligibility.');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Rule Creation Section */}
            <Card className="card-shadow">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-indigo-700">Create New Rule</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Input
                            placeholder="Enter rule name"
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            className="w-full"
                        />
                        <Input
                            placeholder="Enter rule expression"
                            value={inputExpression}
                            onChange={(e) => setInputExpression(e.target.value)}
                            className="w-full"
                        />
                        <Button onClick={addRule} className="w-full animated-button">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Rule
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Rule List Section */}
                <Card className="card-shadow">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-indigo-700">Available Rules</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                            {rules.map((rule) => (
                                <div key={rule._id} className="flex items-center justify-between mb-2 text-gray-700">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedRuleIds.includes(rule._id)}
                                            onChange={() => toggleRuleSelection(rule._id)}
                                            className="mr-2"
                                        />
                                        {rule.name}: {rule.expression}
                                    </div>
                                    <Button variant="ghost" onClick={() => deleteRule(rule._id)} >
                                        <XCircle className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Eligibility Check Section */}
                <Card className="card-shadow">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-indigo-700">Eligibility Check</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Input
                                placeholder="Enter age"
                                onChange={(e) => handleInputChange('age', e.target.value)}
                                className="w-full"
                            />
                            <Input
                                placeholder="Enter salary"
                                onChange={(e) => handleInputChange('salary', e.target.value)}
                                className="w-full"
                            />
                            <Input
                                placeholder="Enter department"
                                onChange={(e) => handleInputChange('department', e.target.value)}
                                className="w-full"
                            />
                            <Button
                                onClick={checkEligibility}
                                className="w-full animated-button mt-4"
                            >
                                Check Eligibility
                            </Button>
                            {eligibility && (
                                <div
                                    className={`text-3xl font-bold flex items-center justify-center ${eligibility === 'Eligible' ? 'text-green-600' : 'text-red-600'
                                        }`}
                                >
                                    {eligibility === 'Eligible' ? (
                                        <CheckCircle className="mr-2 h-8 w-8" />
                                    ) : (
                                        <XCircle className="mr-2 h-8 w-8" />
                                    )}
                                    {eligibility}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
