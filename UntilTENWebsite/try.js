import React, { useState } from 'react';
import { AlertTriangle, XCircle, CheckCircle, TrendingDown } from 'lucide-react';

const EquationProblems = () => {
const [inputs, setInputs] = useState({
    revenue: 50000000,
    ebitdaMargin: 20,
    revenueGrowth: 8,
    wacc: 10,
    terminalGrowth: 3,
    taxRate: 30,
    capex: 1500000,
    deltaWC: 500000,
    maxSynergy: 5000000,
    integrationCost: 2000000,
    synergyRiskDiscount: 20,
});
};

const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
};

const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    }).format(num);
};

// Traditional DCF
const calculateDCF = () => {
    let totalPV = 0;
    let currentRevenue = inputs.revenue;
    
    for (let year = 1; year <= 5; year++) {
    currentRevenue = currentRevenue * (1 + inputs.revenueGrowth / 100);
    const ebitda = currentRevenue * (inputs.ebitdaMargin / 100);
    const nopat = ebitda * (1 - inputs.taxRate / 100);
    const fcf = nopat - inputs.capex - inputs.deltaWC;
    const pv = fcf / Math.pow(1 + inputs.wacc / 100, year);
    totalPV += pv;
    }
    
    const finalRevenue = inputs.revenue * Math.pow(1 + inputs.revenueGrowth / 100, 5);
    const finalEBITDA = finalRevenue * (inputs.ebitdaMargin / 100);
    const finalNOPAT = finalEBITDA * (1 - inputs.taxRate / 100);
    const finalFCF = finalNOPAT - inputs.capex - inputs.deltaWC;
    const tv = (finalFCF * (1 + inputs.terminalGrowth / 100)) / ((inputs.wacc - inputs.terminalGrowth) / 100);
    const tvPV = tv / Math.pow(1 + inputs.wacc / 100, 5);
    
    return { totalPV, tvPV, ev: totalPV + tvPV };
};

// Your model with synergies (what you think you're doing)
const calculateYourModel = () => {
    let totalPV = 0;
    let currentRevenue = inputs.revenue;
    const avgSynergy = inputs.maxSynergy * 0.8 * 0.8 * (1 - inputs.synergyRiskDiscount / 100); // rough average
    
    for (let year = 1; year <= 5; year++) {
    currentRevenue = currentRevenue * (1 + inputs.revenueGrowth / 100);
    const ebitda = currentRevenue * (inputs.ebitdaMargin / 100);
    const nopat = ebitda * (1 - inputs.taxRate / 100);
    const integrationCost = year === 1 ? inputs.integrationCost : 0;
    const fcf = nopat - inputs.capex - inputs.deltaWC - integrationCost + avgSynergy;
    const pv = fcf / Math.pow(1 + inputs.wacc / 100, year);
    totalPV += pv;
    }
    
    const finalRevenue = inputs.revenue * Math.pow(1 + inputs.revenueGrowth / 100, 5);
    const finalEBITDA = finalRevenue * (inputs.ebitdaMargin / 100);
    const finalNOPAT = finalEBITDA * (1 - inputs.taxRate / 100);
    const finalFCF = finalNOPAT - inputs.capex - inputs.deltaWC + avgSynergy;
    const tv = (finalFCF * (1 + inputs.terminalGrowth / 100)) / ((inputs.wacc - inputs.terminalGrowth) / 100);
    const tvPV = tv / Math.pow(1 + inputs.wacc / 100, 5);
    
    return { totalPV, tvPV, ev: totalPV + tvPV };
};

const dcf = calculateDCF();
const yourModel = calculateYourModel();
const difference = yourModel.ev - dcf.ev;
const percentDiff = (difference / dcf.ev) * 100;

// Calculate what synergies are worth in PV terms
const avgSynergy = inputs.maxSynergy * 0.8 * 0.8 * (1 - inputs.synergyRiskDiscount / 100);
const synergyPV5Years = (avgSynergy * (1 - Math.pow(1 / (1 + inputs.wacc / 100), 6))) / (inputs.wacc / 100);
const synergyInTerminal = (avgSynergy * (1 + inputs.terminalGrowth / 100)) / ((inputs.wacc - inputs.terminalGrowth) / 100);
const synergyTerminalPV = synergyInTerminal / Math.pow(1 + inputs.wacc / 100, 5);
const totalSynergyValue = synergyPV5Years + synergyTerminalPV;

return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50">
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-red-800 mb-2 flex items-center gap-2">
        <AlertTriangle size={36} />
        Critical Problems in Your Model
        </h1>
        <p className="text-gray-600 mb-6">Why it overvalues even with "risk adjustments"</p>

        {/* Inputs */}
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Test Inputs</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Revenue ($M)</label>
            <input
                type="number"
                value={inputs.revenue / 1000000}
                onChange={(e) => handleChange('revenue', e.target.value * 1000000)}
                className="w-full px-3 py-2 border rounded"
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">EBITDA Margin (%)</label>
            <input
                type="number"
                value={inputs.ebitdaMargin}
                onChange={(e) => handleChange('ebitdaMargin', e.target.value)}
                className="w-full px-3 py-2 border rounded"
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Synergy ($M)</label>
            <input
                type="number"
                value={inputs.maxSynergy / 1000000}
                onChange={(e) => handleChange('maxSynergy', e.target.value * 1000000)}
                className="w-full px-3 py-2 border rounded"
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Integration Cost ($M)</label>
            <input
                type="number"
                value={inputs.integrationCost / 1000000}
                onChange={(e) => handleChange('integrationCost', e.target.value * 1000000)}
                className="w-full px-3 py-2 border rounded"
            />
            </div>
        </div>
        </div>
        </div>
        {/* The Problem Revealed */}
        <div className="bg-red-50 border-2 border-red-500 p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-2">
            <XCircle size={28} />
            THE CORE PROBLEM
        </h2>
        <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Traditional DCF</div>
            <div className="text-3xl font-bold text-green-700">{formatCurrency(dcf.ev)}</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Your Model (with "risk adjustment")</div>
            <div className="text-3xl font-bold text-red-700">{formatCurrency(yourModel.ev)}</div>
            </div>
        </div>
        <div className="bg-red-900 text-white p-4 rounded-lg">
            <div className="text-lg font-bold">
            Your model is {formatCurrency(difference)} HIGHER ({percentDiff.toFixed(1)}%)
            </div>
            <div className="text-sm mt-2">
            This makes NO SENSE if you're truly adding risk adjustments. You're actually ADDING value, not adjusting for risk.
            </div>
        </div>
        </div>

        {/* Problems Breakdown */}
        <div className="space-y-6 mb-6">
        {/* Problem 1 */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-bold text-orange-900 mb-3 flex items-center gap-2">
            <AlertTriangle size={24} />
            Problem #1: Synergies in PERPETUITY
            </h3>
            <div className="space-y-3">
            <div className="bg-white p-4 rounded">
                <div className="font-semibold mb-2">What You're Doing:</div>
                <div className="text-sm font-mono bg-gray-100 p-2 rounded">
                Terminal Value = (FCF + Synergy) × (1+g) / (WACC-g)
                </div>
                <div className="text-sm mt-2 text-red-700">
                You're assuming synergies continue FOREVER in the terminal value calculation.
                </div>
            </div>
            
            <div className="bg-white p-4 rounded">
                <div className="font-semibold mb-2">The Math:</div>
                <div className="text-sm space-y-1">
                <div>• Synergy per year: ~{formatCurrency(avgSynergy)}</div>
                <div>• PV of 5 years: {formatCurrency(synergyPV5Years)}</div>
                <div className="text-red-700 font-bold">• Value in terminal (FOREVER): {formatCurrency(synergyTerminalPV)}</div>
                <div className="text-red-700 font-bold">• Total synergy value added: {formatCurrency(totalSynergyValue)}</div>
                </div>
            </div>

            <div className="bg-red-100 p-4 rounded border border-red-400">
                <div className="font-bold text-red-900 mb-2">Why This is WRONG:</div>
                <ul className="text-sm text-red-800 space-y-1">
                <li>• Synergies are ONE-TIME gains from combining companies</li>
                <li>• They don't grow forever at the terminal growth rate</li>
                <li>• Competitors will erode any cost advantages over time</li>
                <li>• You're essentially valuing {formatCurrency(inputs.maxSynergy)}/year in perpetuity = {formatCurrency(synergyInTerminal)} of extra value!</li>
                </ul>
            </div>

            <div className="bg-green-100 p-4 rounded border border-green-400">
                <div className="font-bold text-green-900 mb-2">The Fix:</div>
                <div className="text-sm text-green-800">
                <strong>Option 1:</strong> Exclude synergies from terminal value entirely
                <div className="font-mono mt-1 bg-white p-2 rounded">
                    TV = (FCF_base × (1+g)) / (WACC-g)
                </div>
                <div className="mt-2">
                    <strong>Option 2:</strong> Decay synergies to zero over 10 years
                </div>
                <div className="font-mono mt-1 bg-white p-2 rounded">
                    Synergy_t = MaxSynergy × (1 - t/10) for t = 1 to 10
                </div>
                </div>
            </div>
            </div>
        </div>

        {/* Problem 2 */}
        <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
            <AlertTriangle size={24} />
            Problem #2: Integration Cost is TRIVIAL vs Synergy Value
            </h3>
            <div className="space-y-3">
            <div className="bg-white p-4 rounded">
                <div className="font-semibold mb-2">The Imbalance:</div>
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-sm text-gray-600">Integration Cost (Year 1 only)</div>
                    <div className="text-2xl font-bold text-red-700">{formatCurrency(inputs.integrationCost)}</div>
                    <div className="text-xs text-gray-500">One-time hit</div>
                </div>
                <div>
                    <div className="text-sm text-gray-600">Total Synergy Value</div>
                    <div className="text-2xl font-bold text-green-700">{formatCurrency(totalSynergyValue)}</div>
                    <div className="text-xs text-gray-500">Over all time</div>
                </div>
                </div>
                <div className="mt-3 p-3 bg-red-100 rounded">
                <div className="font-bold text-red-900">
                    Ratio: {(totalSynergyValue / inputs.integrationCost).toFixed(1)}x more value from synergies than cost!
                </div>
                <div className="text-sm text-red-800 mt-1">
                    In reality, integration often costs 2-3x the synergy value and takes years
                </div>
                </div>
            </div>

            <div className="bg-green-100 p-4 rounded border border-green-400">
                <div className="font-bold text-green-900 mb-2">The Fix:</div>
                <ul className="text-sm text-green-800 space-y-1">
                <li>• Integration costs should span 2-3 years, not just Year 1</li>
                <li>• Total integration = 1.5-2.0x annual synergy value</li>
                <li>• Example: $5M synergy → $7.5-10M integration over 3 years</li>
                <li>• Phased: Year 1 = 50%, Year 2 = 35%, Year 3 = 15%</li>
                </ul>
            </div>
            </div>
        </div>

        {/* Problem 3 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-bold text-yellow-900 mb-3 flex items-center gap-2">
            <AlertTriangle size={24} />
            Problem #3: "Risk Discount" is Actually OPTIMISM
            </h3>
            <div className="space-y-3">
            <div className="bg-white p-4 rounded">
                <div className="font-semibold mb-2">Your Current Math:</div>
                <div className="space-y-2 text-sm">
                <div className="font-mono bg-gray-100 p-2 rounded">
                    Synergy = MaxSynergy × RampFactor × SRF × (1 - 20%)
                </div>
                <div className="font-mono bg-gray-100 p-2 rounded">
                    Example: $5M × 1.0 × 0.95 × 0.8 = $3.8M per year
                </div>
                </div>
                <div className="mt-3 p-3 bg-yellow-100 rounded">
                <div className="font-bold text-yellow-900">Problem:</div>
                <div className="text-sm text-yellow-800">
                    You're still assuming 76% ($3.8M / $5M) of max synergies are captured. 
                    Studies show only 30-50% of projected synergies are actually realized.
                </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded">
                <div className="font-semibold mb-2">What Studies Show:</div>
                <div className="text-sm space-y-2">
                <div className="p-2 bg-red-50 rounded">
                    <strong>McKinsey Research:</strong> Only 30-35% of expected synergies captured on average
                </div>
                <div className="p-2 bg-red-50 rounded">
                    <strong>BCG Study:</strong> 70% of M&A deals fail to deliver promised value
                </div>
                <div className="p-2 bg-red-50 rounded">
                    <strong>Bain Analysis:</strong> Integration costs often exceed synergy value
                </div>
                </div>
            </div>

            <div className="bg-green-100 p-4 rounded border border-green-400">
                <div className="font-bold text-green-900 mb-2">The Fix:</div>
                <ul className="text-sm text-green-800 space-y-1">
                <li>• <strong>Conservative Case:</strong> 30% of max synergies (use for valuation floor)</li>
                <li>• <strong>Base Case:</strong> 50% of max synergies (use for offer price)</li>
                <li>• <strong>Optimistic Case:</strong> 70% of max synergies (best case scenario)</li>
                <li>• Never assume more than 70% capture rate without detailed proof</li>
                </ul>
            </div>
            </div>
        </div>

        {/* Problem 4 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
            <AlertTriangle size={24} />
            Problem #4: No Discount Rate Adjustment for Risk
            </h3>
            <div className="space-y-3">
            <div className="bg-white p-4 rounded">
                <div className="font-semibold mb-2">What You're Doing:</div>
                <div className="text-sm">
                You discount synergies at the same WACC ({inputs.wacc}%) as base cash flows.
                </div>
                <div className="mt-2 p-3 bg-blue-100 rounded">
                <div className="font-bold text-blue-900">Problem:</div>
                <div className="text-sm text-blue-800">
                    Synergies are MUCH riskier than base business cash flows. They depend on:
                    <ul className="mt-2 ml-4 space-y-1">
                    <li>• Successful integration (60% fail)</li>
                    <li>• No key employee departures</li>
                    <li>• Customer retention</li>
                    <li>• Cultural fit</li>
                    <li>• Technology integration</li>
                    </ul>
                </div>
                </div>
            </div>

            <div className="bg-green-100 p-4 rounded border border-green-400">
                <div className="font-bold text-green-900 mb-2">The Fix:</div>
                <div className="text-sm text-green-800">
                Use a higher discount rate for synergies:
                <div className="font-mono mt-2 bg-white p-2 rounded">
                    Synergy Discount Rate = WACC + Risk Premium
                </div>
                <div className="mt-2">
                    <strong>Recommended Risk Premium:</strong>
                    <ul className="mt-1 ml-4 space-y-1">
                    <li>• Cost synergies: +3-5% (more achievable)</li>
                    <li>• Revenue synergies: +5-8% (very uncertain)</li>
                    <li>• Example: WACC 10% → Synergy rate 15-18%</li>
                    </ul>
                </div>
                </div>
            </div>
            </div>
        </div>

        {/* Problem 5 */}
        <div className="bg-pink-50 border-l-4 border-pink-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-bold text-pink-900 mb-3 flex items-center gap-2">
            <AlertTriangle size={24} />
            Problem #5: Tail Risk is Applied AFTER, Not DURING
            </h3>
            <div className="space-y-3">
            <div className="bg-white p-4 rounded">
                <div className="font-semibold mb-2">Your Approach:</div>
                <div className="text-sm font-mono bg-gray-100 p-2 rounded mb-2">
                EV_tail = EV_base × (1 - 15%)
                </div>
                <div className="text-sm">
                You calculate full value first, then haircut 15% at the end.
                </div>
                <div className="mt-2 p-3 bg-pink-100 rounded">
                <div className="font-bold text-pink-900">Problem:</div>
                <div className="text-sm text-pink-800">
                    This is the equivalent of calculating a price and then saying "Oh wait, there's risk, let me discount."
                    Risk should be baked into the WACC from the start, not applied as an afterthought.
                </div>
                </div>
            </div>

            <div className="bg-green-100 p-4 rounded border border-green-400">
                <div className="font-bold text-green-900 mb-2">The Fix:</div>
                <ul className="text-sm text-green-800 space-y-1">
                <li>• <strong>Option 1:</strong> Increase WACC to reflect acquisition risk (add 2-3%)</li>
                <li>• <strong>Option 2:</strong> Use scenario probabilities properly:
                    <div className="font-mono mt-1 bg-white p-2 rounded text-xs">
                    EV = (30% × EV_bear) + (50% × EV_base) + (20% × EV_bull)
                    </div>
                </li>
                <li>• Don't do both increased WACC AND tail adjustment (double counting)</li>
                </ul>
            </div>
            </div>
        </div>
        </div>

        {/* Corrected Model */}
        <div className="bg-green-50 border-2 border-green-500 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
            <CheckCircle size={28} />
            CORRECTED APPROACH
        </h2>
        
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Step 1: Base DCF (No Synergies)</h3>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(dcf.ev)}</div>
            <div className="text-sm text-gray-600">This is your floor - walk away if price exceeds this by too much</div>
            </div>

            <div className="bg-white p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Step 2: Calculate Synergy Value (PROPERLY)</h3>
            <div className="text-sm space-y-2">
                <div className="font-mono bg-gray-100 p-2 rounded">
                Conservative Synergy = MaxSynergy × 30%
                <br/>= {formatCurrency(inputs.maxSynergy)} × 30% = {formatCurrency(inputs.maxSynergy * 0.3)}
                </div>
                <div className="font-mono bg-gray-100 p-2 rounded">
                Discount at higher rate (WACC + 5% = {inputs.wacc + 5}%)
                </div>
                <div className="font-mono bg-gray-100 p-2 rounded">
                PV of 5 years ONLY (no terminal synergies)
                <br/>≈ {formatCurrency((inputs.maxSynergy * 0.3) * 3.5)} (rough calculation)
                </div>
            </div>
            </div>

            <div className="bg-white p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Step 3: Subtract Integration Costs</h3>
            <div className="text-sm space-y-2">
                <div className="font-mono bg-gray-100 p-2 rounded">
                Total Integration = 1.5-2x annual synergies
                <br/>= 1.75 × {formatCurrency(inputs.maxSynergy)} = {formatCurrency(inputs.maxSynergy * 1.75)}
                </div>
                <div className="font-mono bg-gray-100 p-2 rounded">
                PV of integration costs over 3 years
                <br/>≈ {formatCurrency(inputs.maxSynergy * 1.75 * 0.9)} (rough discounted)
                </div>
            </div>
            </div>

            <div className="bg-green-700 text-white p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Step 4: Maximum Justifiable Price</h3>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                <span>Base DCF:</span>
                <span className="text-xl font-bold">{formatCurrency(dcf.ev)}</span>
                </div>
                <div className="flex justify-between items-center">
                <span>+ Conservative Synergy Value:</span>
                <span className="text-xl font-bold">+{formatCurrency((inputs.maxSynergy * 0.3) * 3.5)}</span>
                </div>
                <div className="flex justify-between items-center">
                <span>- Integration Costs:</span>
                <span className="text-xl font-bold">-{formatCurrency(inputs.maxSynergy * 1.75 * 0.9)}</span>
                </div>
                <div className="border-t border-green-500 pt-2 flex justify-between items-center">
                <span className="text-lg font-bold">Maximum Price:</span>
                <span className="text-3xl font-bold">
                    {formatCurrency(dcf.ev + (inputs.maxSynergy * 0.3) * 3.5 - inputs.maxSynergy * 1.75 * 0.9)}
                </span>
                </div>
                <div className="text-sm opacity-90 text-center mt-2">
                Much more realistic than {formatCurrency(yourModel.ev)}!
                </div>
            </div>
            </div>
        </div>
        </div>

        {/* Key Takeaways */}
        <div className="mt-6 bg-gray-800 text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">🎯 Key Takeaways</h3>
            <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                <div className="text-red-400 font-bold">1.</div>
                <div>
                    <strong>NEVER include synergies in terminal value</strong> - they're finite gains, not perpetual growth
                </div>
                </div>
                <div className="flex items-start gap-2">
                <div className="text-red-400 font-bold">2.</div>
                <div>
                    <strong>Integration costs should be 1.5-2x synergy value</strong> - not a trivial $2M when synergies are worth $150M+
                </div>
                </div>
                <div className="flex items-start gap-2">
                <div className="text-red-400 font-bold">3.</div>
                <div>
                    <strong>Assume 30-50% synergy capture</strong> - not 70-80%. Be conservative.
                </div>
                </div>
                <div className="flex items-start gap-2">
                <div className="text-red-400 font-bold">4.</div>
                <div>
                    <strong>Discount synergies at higher rate</strong> - WACC + 3-8% depending on risk
                </div>
                </div>
                <div className="flex items-start gap-2">
                <div className="text-red-400 font-bold">5.</div>
                <div>
                    <strong>Build risk into the model</strong> - don't apply arbitrary haircuts at the end
                </div>
            </div>
            </div>
        </div>
        {/* Key Takeaways */}
        <div className="mt-6 bg-gray-800 text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">🎯 Key Takeaways</h3>
            <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
            <div className="text-red-400 font-bold">1.</div>
            <div>
                <strong>NEVER include synergies in terminal value</strong> - they're finite gains, not perpetual growth
            </div>
            </div>
        <div className="flex items-start gap-2">
        <div className="text-red-400 font-bold">2.</div>
        <div>
            <strong>Integration costs should be 1.5-2x synergy value</strong> - not a trivial $2M when synergies are worth $150M+
        </div>
        </div>
        <div className="flex items-start gap-2">
        <div className="text-red-400 font-bold">3.</div>
        <div>
            <strong>Assume 30-50% synergy capture</strong> - not 70-80%. Be conservative.
        </div>
        </div>
        <div className="flex items-start gap-2">
        <div className="text-red-400 font-bold">4.</div>
        <div>
            <strong>Discount synergies at higher rate</strong> - WACC + 3-8% depending on risk
        </div>
        </div>
        <div className="flex items-start gap-2">
        <div className="text-red-400 font-bold">5.</div>
        <div>
            <strong>Build risk into the model</strong> - don't apply arbitrary haircuts at the end
        </div>
        </div>
    {/* Summary Comparison */}
    <div className="mt-6 bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-lg">
    <h3 className="text-2xl font-bold mb-4">📊 Bottom Line Comparison</h3>
    <div className="grid grid-cols-3 gap-4">
        <div className="bg-white bg-opacity-20 p-4 rounded">
        <div className="text-sm opacity-90">Your Model (Broken)</div>
        <div className="text-3xl font-bold">{formatCurrency(yourModel.ev)}</div>
        <div className="text-xs mt-1">❌ Overvalued</div>
        </div>
        <div className="bg-white bg-opacity-20 p-4 rounded">
        <div className="text-sm opacity-90">Traditional DCF</div>
        <div className="text-3xl font-bold">{formatCurrency(dcf.ev)}</div>
        <div className="text-xs mt-1">✅ Floor value</div>
        </div>
        <div className="bg-white bg-opacity-20 p-4 rounded">
        <div className="text-sm opacity-90">Corrected Approach</div>
        <div className="text-3xl font-bold">
            {formatCurrency(dcf.ev + (inputs.maxSynergy * 0.3) * 3.5 - inputs.maxSynergy * 1.75 * 0.9)}
        </div>
        <div className="text-xs mt-1">✅ Realistic ceiling</div>
        </div>
    </div>
    </div>

    {/* Key Takeaways */}
    <div className="mt-6 bg-gray-800 text-white p-6 rounded-lg">
    <h3 className="text-2xl font-bold mb-4">🎯 Key Takeaways</h3>
    <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
        <div className="text-red-400 font-bold">1.</div>
        <div>
            <strong>NEVER include synergies in terminal value</strong> - they're finite gains, not perpetual growth. This alone adds {formatCurrency(synergyTerminalPV)} of fake value!
        </div>
        </div>
        <div className="flex items-start gap-2">
        <div className="text-red-400 font-bold">2.</div>
        <div>
            <strong>Integration costs should be 1.5-2x synergy value</strong> - not a trivial {formatCurrency(inputs.integrationCost)} when synergies are worth {formatCurrency(totalSynergyValue)}
        </div>
        </div>
        <div className="flex items-start gap-2">
        <div className="text-red-400 font-bold">3.</div>
        <div>
            <strong>Assume 30-50% synergy capture</strong> - not 70-80%. McKinsey data shows only 30-35% average capture rate.
        </div>
        </div>
        <div className="flex items-start gap-2">
        <div className="text-red-400 font-bold">4.</div>
        <div>
            <strong>Discount synergies at higher rate</strong> - WACC + 3-8% depending on risk. They're NOT as certain as base cash flows.
        </div>
        </div>
        <div className="flex items-start gap-2">
        <div className="text-red-400 font-bold">5.</div>
        <div>
            <strong>Build risk into the model</strong> - don't apply arbitrary haircuts at the end. Use proper scenario analysis or risk-adjusted rates.
        </div>
        </div>
        <div className="flex items-start gap-2 pt-3 border-t border-gray-600">
        <div className="text-yellow-400 font-bold">💡</div>
        <div>
            <strong>Your intuition was RIGHT:</strong> If you're adding "risk adjustments" but the value goes UP, something is fundamentally broken. The issues are: perpetual synergies, trivial integration costs, optimistic capture rates, and no risk premium on synergies.
        </div>
        </div>
    </div>
    </div>
</div>
</div>
</div>
);