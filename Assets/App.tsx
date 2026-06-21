import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw, 
  ShieldAlert, 
  Coins, 
  Scale,
  Landmark,
  Sparkles
} from 'lucide-react';

// Helper to format currency in Indian numbering style (e.g., ₹10,00,000)
const formatINR = (value: number, decimals: number = 0): string => {
  if (isNaN(value)) return '₹0';
  const absValue = Math.abs(value);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(absValue);
  return value < 0 ? `-₹${formatted}` : `₹${formatted}`;
};

// Helper to format general numbers in Indian style
const formatNumber = (value: number, decimals: number = 2): string => {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(value);
};

// Interface for Slider Input Props
interface SliderInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  prefix?: string;
  tooltip?: string;
}

// Robust Slider + Number Input Component that stays perfectly in sync
const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = '',
  prefix = '',
  tooltip
}) => {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  // Keep local string state in sync if external value changes (e.g., reset button)
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setInputValue(rawVal);
    const parsed = parseFloat(rawVal);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const handleInputBlur = () => {
    let parsed = parseFloat(inputValue);
    if (isNaN(parsed)) {
      parsed = min;
    } else if (parsed < min) {
      parsed = min;
    } else if (parsed > max) {
      parsed = max;
    }
    setInputValue(parsed.toString());
    onChange(parsed);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    setInputValue(parsed.toString());
    onChange(parsed);
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-semibold text-slate-700">{label}</label>
          {tooltip && (
            <span className="group relative cursor-help">
              <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 inline" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-800 text-white text-xs rounded p-2 w-48 text-center shadow-lg z-20">
                {tooltip}
              </span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all">
          {prefix && <span className="text-slate-500 font-medium text-sm">{prefix}</span>}
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            step={step}
            min={min}
            max={max}
            className="w-20 bg-transparent text-right font-bold text-slate-800 focus:outline-hidden text-sm"
          />
          {unit && <span className="text-slate-500 font-medium text-sm">{unit}</span>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-hidden"
        />
      </div>
      <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
        <span>{prefix}{formatNumber(min, step % 1 !== 0 ? 1 : 0)}{unit}</span>
        <span>{prefix}{formatNumber(max, step % 1 !== 0 ? 1 : 0)}{unit}</span>
      </div>
    </div>
  );
};

export default function App() {
  // Default Values
  const DEFAULT_INITIAL_GOLD = 100; // grams
  const DEFAULT_GOLD_PRICE = 7500; // ₹ per gram
  const DEFAULT_LTV = 75; // %
  const DEFAULT_LOAN_INTEREST = 11.0; // %
  const DEFAULT_GOLD_APPRECIATION = 15.0; // %
  const DEFAULT_SAVINGS_INTEREST = 0.0; // %

  // State for Inputs
  const [initialGoldGrams, setInitialGoldGrams] = useState<number>(DEFAULT_INITIAL_GOLD);
  const [currentGoldPrice, setCurrentGoldPrice] = useState<number>(DEFAULT_GOLD_PRICE);
  const [ltvPercent, setLtvPercent] = useState<number>(DEFAULT_LTV);
  const [loanInterestPercent, setLoanInterestPercent] = useState<number>(DEFAULT_LOAN_INTEREST);
  const [goldAppreciationPercent, setGoldAppreciationPercent] = useState<number>(DEFAULT_GOLD_APPRECIATION);
  const [savingsInterestPercent, setSavingsInterestPercent] = useState<number>(DEFAULT_SAVINGS_INTEREST);

  // State for Collapsible Info Box
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(true);

  // Reset handler
  const handleReset = () => {
    setInitialGoldGrams(DEFAULT_INITIAL_GOLD);
    setCurrentGoldPrice(DEFAULT_GOLD_PRICE);
    setLtvPercent(DEFAULT_LTV);
    setLoanInterestPercent(DEFAULT_LOAN_INTEREST);
    setGoldAppreciationPercent(DEFAULT_GOLD_APPRECIATION);
    setSavingsInterestPercent(DEFAULT_SAVINGS_INTEREST);
  };

  // Calculations wrapped in useMemo for optimal performance and instant live recalculation
  const calc = useMemo(() => {
    // Robustness fallback if NaNs creep in
    const goldGrams = isNaN(initialGoldGrams) ? DEFAULT_INITIAL_GOLD : initialGoldGrams;
    const goldPrice = isNaN(currentGoldPrice) ? DEFAULT_GOLD_PRICE : currentGoldPrice;
    const ltv = isNaN(ltvPercent) ? DEFAULT_LTV : ltvPercent;
    const loanInt = isNaN(loanInterestPercent) ? DEFAULT_LOAN_INTEREST : loanInterestPercent;
    const appreciation = isNaN(goldAppreciationPercent) ? DEFAULT_GOLD_APPRECIATION : goldAppreciationPercent;
    const savInt = isNaN(savingsInterestPercent) ? DEFAULT_SAVINGS_INTEREST : savingsInterestPercent;

    // 1. Initial Gold Value
    const initialGoldValue = goldGrams * goldPrice;

    // 2. Loan Amount Received
    const loanAmount = initialGoldValue * (ltv / 100);

    // 3. Gold bought immediately
    const goldBoughtGrams = goldPrice > 0 ? loanAmount / goldPrice : 0;

    // 4. Total gold controlled (pledged + in hand)
    const totalGoldControlled = goldGrams + goldBoughtGrams;

    // 5. Repayment amount after 1 year (simple interest on gold loan)
    const loanInterestAmount = loanAmount * (loanInt / 100);
    const repaymentDue = loanAmount + loanInterestAmount;

    // 6. Required monthly saving
    // If monthly savings interest rate > 0, treat as annual rate compounded monthly (solve for PMT).
    // If 0, just repayment_due / 12.
    let monthlySaving = 0;
    let totalCashSaved = 0;
    if (savInt > 0) {
      const r = (savInt / 100) / 12;
      const n = 12; // 12 months
      // FV = PMT * (( (1 + r)^n - 1 ) / r) => PMT = (FV * r) / ( (1 + r)^n - 1 )
      monthlySaving = (repaymentDue * r) / (Math.pow(1 + r, n) - 1);
      totalCashSaved = monthlySaving * 12;
    } else {
      monthlySaving = repaymentDue / 12;
      totalCashSaved = repaymentDue;
    }

    // 7. Final gold price after 1 year
    const finalGoldPrice = goldPrice * (1 + appreciation / 100);

    // 8. Final value of all gold
    const finalGoldValue = totalGoldControlled * finalGoldPrice;

    // 9. Net wealth at end (gold value - repayment)
    const netWealth = finalGoldValue - repaymentDue;

    // 10. Absolute Profit (₹) & Return % on initial gold only
    const absoluteProfitInitialGold = netWealth - initialGoldValue;
    const returnPercentInitialGold = initialGoldValue > 0 ? (absoluteProfitInitialGold / initialGoldValue) * 100 : 0;

    // 11. Total capital deployed (initial gold value + all cash saved) & Return % on total capital deployed
    const totalCapitalDeployed = initialGoldValue + totalCashSaved;
    const absoluteProfitTotalCapital = finalGoldValue - totalCapitalDeployed;
    const returnPercentTotalCapital = totalCapitalDeployed > 0 ? (absoluteProfitTotalCapital / totalCapitalDeployed) * 100 : 0;

    // B. Comparison with Simple HODL
    // 12. Final value if just held original gold
    const hodlFinalValue = goldGrams * finalGoldPrice;
    // 13. HODL absolute profit
    const hodlAbsoluteProfit = hodlFinalValue - initialGoldValue;
    // 14. HODL return %
    const hodlReturnPercent = initialGoldValue > 0 ? (hodlAbsoluteProfit / initialGoldValue) * 100 : 0;
    // 15. Your strategy extra profit vs HODL
    const extraProfitVsHodl = absoluteProfitInitialGold - hodlAbsoluteProfit;

    return {
      initialGoldValue,
      loanAmount,
      goldBoughtGrams,
      totalGoldControlled,
      loanInterestAmount,
      repaymentDue,
      monthlySaving,
      totalCashSaved,
      finalGoldPrice,
      finalGoldValue,
      netWealth,
      absoluteProfitInitialGold,
      returnPercentInitialGold,
      totalCapitalDeployed,
      absoluteProfitTotalCapital,
      returnPercentTotalCapital,
      hodlFinalValue,
      hodlAbsoluteProfit,
      hodlReturnPercent,
      extraProfitVsHodl,
      savInt
    };
  }, [initialGoldGrams, currentGoldPrice, ltvPercent, loanInterestPercent, goldAppreciationPercent, savingsInterestPercent]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white shadow-md py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-xs border border-white/30 shadow-inner">
              <Coins className="w-8 h-8 text-amber-100" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                Gold Rotational Strategy Calculator
              </h1>
              <p className="text-amber-100 text-xs sm:text-sm font-medium mt-0.5">
                Simulate wealth creation by leveraging gold loans to acquire additional gold holdings
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold px-4 py-2 rounded-xl border border-white/20 shadow-xs transition-all text-sm cursor-pointer"
            title="Reset all inputs to default values"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Collapsible Info Box */}
        <section className="mb-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
          <button
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 transition-colors text-left border-b border-slate-200 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h2 className="font-bold text-slate-800 text-base sm:text-lg">
                How the Gold Rotational Strategy Works
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>{isInfoOpen ? 'Hide Explanation' : 'Show Explanation'}</span>
              {isInfoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {isInfoOpen && (
            <div className="p-6 bg-white grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
              <div className="space-y-2 relative">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
                  <span className="flex items-center justify-center bg-amber-100 border border-amber-300 rounded-full w-6 h-6 text-xs font-extrabold text-amber-800">1</span>
                  <span>Pledge Initial Gold</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Start with your existing gold holding. You pledge this gold with a bank or NBFC to raise a gold loan at the allowable Loan-to-Value (LTV) ratio (typically 75%).
                </p>
              </div>

              <div className="space-y-2 relative">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
                  <span className="flex items-center justify-center bg-amber-100 border border-amber-300 rounded-full w-6 h-6 text-xs font-extrabold text-amber-800">2</span>
                  <span>Reinvest Instantly</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  You immediately deploy 100% of the loan amount received to buy additional gold at the current market price. You now control significantly more total gold.
                </p>
              </div>

              <div className="space-y-2 relative">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
                  <span className="flex items-center justify-center bg-amber-100 border border-amber-300 rounded-full w-6 h-6 text-xs font-extrabold text-amber-800">3</span>
                  <span>Save Monthly</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  During the 1-year loan tenure, you accumulate the required repayment (Principal + Interest) in a separate savings account. If savings interest &gt; 0%, it compounds monthly to reduce your out-of-pocket deposit!
                </p>
              </div>

              <div className="space-y-2 relative">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
                  <span className="flex items-center justify-center bg-amber-100 border border-amber-300 rounded-full w-6 h-6 text-xs font-extrabold text-amber-800">4</span>
                  <span>Repay &amp; Capture Gain</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  At the end of 1 year, you pay off the loan with your accumulated savings. You fully unlock your pledged gold and retain the newly bought gold, capturing price appreciation on the entire larger holding.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Two-Column Layout (Inputs Left, Results Right on desktop; Stacked on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: INPUTS (5 Cols on LG) */}
          <div className="lg:col-span-5 space-y-2">
            <div className="bg-slate-800 text-white px-5 py-3 rounded-2xl flex items-center gap-2.5 shadow-sm mb-4">
              <Calculator className="w-5 h-5 text-amber-400" />
              <h2 className="font-bold text-lg tracking-tight">Interactive Simulation Inputs</h2>
            </div>

            <SliderInput
              label="Initial Gold Owned"
              value={initialGoldGrams}
              onChange={setInitialGoldGrams}
              min={10}
              max={1000}
              step={5}
              unit=" g"
              tooltip="The amount of gold you currently own and plan to pledge for a gold loan."
            />

            <SliderInput
              label="Current Gold Price"
              value={currentGoldPrice}
              onChange={setCurrentGoldPrice}
              min={5000}
              max={12000}
              step={50}
              prefix="₹"
              unit="/g"
              tooltip="Current prevailing market price of gold per gram."
            />

            <SliderInput
              label="Gold Loan LTV (Loan-to-Value)"
              value={ltvPercent}
              onChange={setLtvPercent}
              min={50}
              max={90}
              step={1}
              unit="%"
              tooltip="Percentage of your pledged gold's value that the lender provides as a loan. RBI guidelines generally permit up to 75% for banks and NBFCs."
            />

            <SliderInput
              label="Gold Loan Annual Interest Rate"
              value={loanInterestPercent}
              onChange={setLoanInterestPercent}
              min={7.0}
              max={20.0}
              step={0.1}
              unit="%"
              tooltip="Annual interest rate charged by the bank/NBFC on the gold loan. Calculated as simple interest due at the end of 1 year."
            />

            <SliderInput
              label="Expected Gold Price Appreciation (1 Yr)"
              value={goldAppreciationPercent}
              onChange={setGoldAppreciationPercent}
              min={-20.0}
              max={50.0}
              step={0.5}
              unit="%"
              tooltip="Expected percentage increase (or decrease) in gold price over the next 1 year. Try negative values to understand downside risks."
            />

            <SliderInput
              label="Monthly Savings Interest Rate"
              value={savingsInterestPercent}
              onChange={setSavingsInterestPercent}
              min={0.0}
              max={15.0}
              step={0.1}
              unit="%"
              tooltip="Annual interest rate earned on your monthly savings deposits. Treated as an annual rate compounded monthly to reach the loan repayment goal. Defaults to 0%."
            />

            {/* Quick Summary Card in Input Column */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900 shadow-xs mt-6">
              <h3 className="font-bold text-sm text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Assumptions &amp; Notes
              </h3>
              <ul className="space-y-2 text-xs leading-relaxed text-slate-700">
                <li>• <strong className="text-slate-900">Savings Account:</strong> {calc.savInt === 0 ? "Assumed 0% savings interest. Monthly saving is exactly Repayment Due ÷ 12." : `Assumed ${calc.savInt}% annual interest compounded monthly. Monthly saving is calculated via PMT formula.`}</li>
                <li>• <strong className="text-slate-900">Loan Repayment:</strong> Assumed bullet repayment of Principal + Interest at the end of 1 year.</li>
                <li>• <strong className="text-slate-900">Purchase Costs:</strong> Assumed zero making charges/GST or that current price reflects the net investable bullion price.</li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: RESULTS (7 Cols on LG) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* SECTION A: STRATEGY DETAILS */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
              <div className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-2.5">
                  <Landmark className="w-5 h-5 text-amber-400" />
                  <h2 className="font-bold text-lg tracking-tight">A. Strategy Details</h2>
                </div>
                <span className="bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs px-2.5 py-1 rounded-full font-semibold">
                  1-Year Horizon
                </span>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Gold Controlled Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 mb-1">Initial Gold Pledged</div>
                    <div className="text-xl font-bold text-slate-800">{formatNumber(initialGoldGrams, 1)} grams</div>
                    <div className="text-xs text-slate-400 mt-0.5">Value: {formatINR(calc.initialGoldValue)}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 mb-1">Gold Bought Immediately</div>
                    <div className="text-xl font-bold text-amber-600">{formatNumber(calc.goldBoughtGrams, 2)} grams</div>
                    <div className="text-xs text-slate-400 mt-0.5">Using Loan: {formatINR(calc.loanAmount)}</div>
                  </div>
                  <div className="sm:border-l sm:border-slate-200 sm:pl-4">
                    <div className="text-xs font-semibold text-slate-700 mb-1">Total Gold Controlled</div>
                    <div className="text-2xl font-black text-slate-900">{formatNumber(calc.totalGoldControlled, 2)} grams</div>
                    <div className="text-xs text-emerald-600 font-medium mt-0.5">+{formatNumber(ltvPercent, 0)}% more gold</div>
                  </div>
                </div>

                {/* Detailed Key-Value Table */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-600">Loan amount received ({ltvPercent}% LTV)</span>
                    <span className="text-base font-bold text-slate-900">{formatINR(calc.loanAmount)}</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-600">Gold bought immediately</span>
                    <span className="text-base font-bold text-slate-900">{formatNumber(calc.goldBoughtGrams, 2)} grams</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-600">Total gold controlled (pledged + in hand)</span>
                    <span className="text-base font-bold text-slate-900">{formatNumber(calc.totalGoldControlled, 2)} grams</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <div>
                      <div className="text-sm font-medium text-slate-600">Repayment amount after 1 year</div>
                      <div className="text-xs text-slate-400">Principal {formatINR(calc.loanAmount)} + Interest {formatINR(calc.loanInterestAmount)}</div>
                    </div>
                    <span className="text-base font-bold text-amber-700">{formatINR(calc.repaymentDue)}</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100 bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        Required monthly saving ({calc.savInt === 0 ? '0% savings interest' : `${calc.savInt}% savings interest`})
                      </div>
                      <div className="text-xs text-slate-500">
                        {calc.savInt === 0 ? 'Repayment Due ÷ 12 months' : 'Compounded monthly deposit (PMT)'}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-slate-900">{formatINR(calc.monthlySaving)}</span>
                      <div className="text-xs text-slate-500">Total cash saved: {formatINR(calc.totalCashSaved)}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <div>
                      <div className="text-sm font-medium text-slate-600">Final gold price after 1 year</div>
                      <div className="text-xs text-slate-400">({goldAppreciationPercent >= 0 ? '+' : ''}{goldAppreciationPercent}% appreciation)</div>
                    </div>
                    <span className="text-base font-bold text-slate-900">{formatINR(calc.finalGoldPrice)} /g</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-600">Final value of all gold ({formatNumber(calc.totalGoldControlled, 2)}g)</span>
                    <span className="text-base font-bold text-slate-900">{formatINR(calc.finalGoldValue)}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-slate-200 bg-slate-50 px-3 rounded-lg">
                    <div>
                      <div className="text-sm font-bold text-slate-800">Net wealth at end</div>
                      <div className="text-xs text-slate-500">(Final gold value – loan repayment)</div>
                    </div>
                    <span className="text-xl font-black text-slate-900">{formatINR(calc.netWealth)}</span>
                  </div>
                </div>

                {/* Return Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  
                  {/* Metric 1: Initial Gold Only */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        On Initial Gold Only
                      </div>
                      <div className="text-xs text-slate-600 mb-3 leading-relaxed">
                        Evaluates profit and return against the starting value of your original gold ({formatINR(calc.initialGoldValue)}).
                      </div>
                    </div>
                    <div className="border-t border-slate-200 pt-3 mt-auto">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-semibold text-slate-500">Absolute Profit</span>
                        <span className={`text-lg font-extrabold ${calc.absoluteProfitInitialGold >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {formatINR(calc.absoluteProfitInitialGold)}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-semibold text-slate-500">Return %</span>
                        <span className={`text-xl font-black flex items-center gap-1 ${calc.returnPercentInitialGold >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {calc.returnPercentInitialGold >= 0 ? <TrendingUp className="w-5 h-5 inline" /> : <TrendingDown className="w-5 h-5 inline" />}
                          {formatNumber(calc.returnPercentInitialGold, 2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metric 2: Total Capital Deployed */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        On Total Capital Deployed
                      </div>
                      <div className="text-xs text-slate-600 mb-3 leading-relaxed">
                        Evaluates profit against initial gold value + all cash saved ({formatINR(calc.initialGoldValue)} + {formatINR(calc.totalCashSaved)} = {formatINR(calc.totalCapitalDeployed)}).
                      </div>
                    </div>
                    <div className="border-t border-slate-200 pt-3 mt-auto">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-semibold text-slate-500">Absolute Profit</span>
                        <span className={`text-lg font-extrabold ${calc.absoluteProfitTotalCapital >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {formatINR(calc.absoluteProfitTotalCapital)}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-semibold text-slate-500">Return %</span>
                        <span className={`text-xl font-black flex items-center gap-1 ${calc.returnPercentTotalCapital >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {calc.returnPercentTotalCapital >= 0 ? <TrendingUp className="w-5 h-5 inline" /> : <TrendingDown className="w-5 h-5 inline" />}
                          {formatNumber(calc.returnPercentTotalCapital, 2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* SECTION B: COMPARISON WITH SIMPLE HODL */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
              <div className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-2.5">
                  <Scale className="w-5 h-5 text-amber-400" />
                  <h2 className="font-bold text-lg tracking-tight">B. Comparison with Simple HODL</h2>
                </div>
                <span className="bg-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-full font-medium">
                  Holding Original Gold
                </span>
              </div>

              <div className="p-6 space-y-6">
                <p className="text-sm text-slate-600 leading-relaxed">
                  "HODL" represents simply keeping your original {formatNumber(initialGoldGrams, 1)} grams of gold without taking any loan or buying additional gold. Here is how the Rotational Strategy compares directly against doing nothing.
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-600">Final value if just held original gold</span>
                    <span className="text-base font-bold text-slate-900">{formatINR(calc.hodlFinalValue)}</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-600">HODL absolute profit</span>
                    <span className={`text-base font-bold ${calc.hodlAbsoluteProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {formatINR(calc.hodlAbsoluteProfit)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-600">HODL return %</span>
                    <span className={`text-base font-bold ${calc.hodlReturnPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {formatNumber(calc.hodlReturnPercent, 2)}%
                    </span>
                  </div>

                  {/* Highlighting Extra Profit */}
                  <div className={`p-5 rounded-2xl border ${calc.extraProfitVsHodl >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'} shadow-xs mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
                    <div>
                      <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${calc.extraProfitVsHodl >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                        {calc.extraProfitVsHodl >= 0 ? 'Strategy Outperformance' : 'Strategy Underperformance'}
                      </div>
                      <div className="text-lg font-extrabold text-slate-900">
                        Your strategy extra profit vs HODL
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {calc.extraProfitVsHodl >= 0 
                          ? 'The rotational leverage successfully generated surplus wealth over simple holding.'
                          : 'The interest cost of the loan exceeded the gains from gold appreciation.'}
                      </div>
                    </div>
                    <div className="text-right sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-slate-200 pt-3 sm:pt-0">
                      <span className={`text-2xl sm:text-3xl font-black block ${calc.extraProfitVsHodl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {formatINR(calc.extraProfitVsHodl)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 block mt-1">
                        {calc.extraProfitVsHodl >= 0 ? 'Extra Profit Generated' : 'Net Loss vs HODL'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* DISCLAIMER SECTION */}
            <footer className="bg-slate-200/70 border border-slate-300 rounded-2xl p-6 text-slate-700 shadow-xs mt-8">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 text-slate-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Disclaimer</h4>
                  <p className="text-xs leading-relaxed text-slate-600 font-medium">
                    This is a simulation based on assumed price appreciation; actual returns may vary. Loan repayment must be funded from separate savings.
                  </p>
                </div>
              </div>
            </footer>

          </div>

        </div>
      </main>
    </div>
  );
}
