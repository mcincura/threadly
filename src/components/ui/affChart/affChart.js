import { useState, useMemo } from "react";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import './affChart.css'
import { IconGraph, IconChartBar, IconCaretDownFilled } from "@tabler/icons-react";
import { components } from "react-select";
import Select from "react-select";

const PERIODS = [
    { label: "7 Days", value: 7, key: "stats7d" },
    { label: "30 Days", value: 30, key: "stats30d" },
    { label: "90 Days", value: 90, key: "stats90d" },
];

const METRICS = [
    { label: "Clicks", value: "clicks", dataKey: "clicks" },
    { label: "Signups", value: "signups", dataKey: "register" },
    { label: "Conversions", value: "conversions", dataKey: "conversions" },
    { label: "Commission", value: "commission", dataKey: "commission" },
];

const CHART_TYPES = [
    { label: "Line", value: "line", icon: <IconGraph size={20} /> },
    { label: "Column", value: "bar", icon: <IconChartBar size={20} /> },
];

function formatYAxisTick(value) {
    if (Math.abs(value) >= 1_000_000) {
        return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (Math.abs(value) >= 1_000) {
        return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return value;
}

const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
        <IconCaretDownFilled
            size={20}
            style={{
                transition: "transform 0.2s",
                transform: props.selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",
                color: "#f1f1f1"
            }}
        />
    </components.DropdownIndicator>
);

const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        background: "#883cf3",
        color: "#f1f1f1",
        border: "transparent",
        borderRadius: "0.5rem",
        fontSize: "1rem",
        minWidth: 170,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        outline: "none",
        cursor: "pointer",
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "#f1f1f1",
    }),
    menu: (provided) => ({
        ...provided,
        background: "#232323",
        color: "#f1f1f1",
        borderRadius: "0.5rem",
        zIndex: 10,
        paddingInline: "0.5rem"
    }),
    option: (provided, state) => ({
        ...provided,
        background: state.isSelected
            ? "#883cf3"
            : state.isFocused
                ? "#363636ff"
                : "#232323",
        color: "#f1f1f1",
        cursor: "pointer",
        borderRadius: "0.5rem",
        marginBlock: "0.25rem"

    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: "#f1f1f1",
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        background: "#883cf3",
    }),
    input: (provided) => ({
        ...provided,
        color: "#f1f1f1",
    }),
};

export default function AffiliateStatsChart({ statsData }) {
    const [period, setPeriod] = useState(PERIODS[1]);
    const [metric, setMetric] = useState(METRICS[0]);
    const [chartType, setChartType] = useState("bar");

    const selectedPeriod = period;
    const selectedMetric = metric;

    const data = useMemo(() => {
        if (!statsData || !selectedPeriod || !selectedMetric) return [];

        const arr = statsData[selectedPeriod.key] || [];

        let chartData = arr.map(d => ({
            date: new Date(d.day).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
            value: Number(d[selectedMetric.dataKey]) || 0,
        }));

        if (chartType === "line") {
            let sum = 0;
            chartData = chartData.map(d => {
                sum += d.value;
                return { ...d, value: sum };
            });
        }

        return chartData;
    }, [statsData, selectedPeriod, selectedMetric, chartType]);

    return (
        <div className="affiliate-chart-controls">
            <div className="affiliate-chart-toolbar">
                <div className="affiliate-chart-toolbar-selects">
                    <Select
                        value={metric}
                        onChange={setMetric}
                        options={METRICS}
                        styles={customSelectStyles}
                        isSearchable={false}
                        classNamePrefix="affchart-select"
                        components={{ DropdownIndicator }}
                    />
                    <Select
                        value={period}
                        onChange={setPeriod}
                        options={PERIODS}
                        styles={customSelectStyles}
                        isSearchable={false}
                        classNamePrefix="affchart-select"
                        components={{ DropdownIndicator }}
                    />
                </div>
                <div className="affiliate-chart-type-toggle">
                    {CHART_TYPES.map(type => (
                        <button
                            key={type.value}
                            className={chartType === type.value ? "active" : ""}
                            onClick={() => setChartType(type.value)}
                            title={type.label}
                            type="button"
                        >
                            {type.icon}
                        </button>
                    ))}
                </div>
            </div>
            <ResponsiveContainer width="100%" className={"affiliate-chart-responsive-container"}>
                {chartType === "line" ? (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#151515" vertical={false} horizontal={true} />
                        <XAxis dataKey="date" stroke="#cccccc" tick={{ fill: "#cccccc" }} />
                        <YAxis
                            stroke="#cccccc"
                            tick={{ fill: "#cccccc" }}
                            tickFormatter={formatYAxisTick}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "#121212",
                                borderRadius: 20,
                                border: "none",
                                color: "#fff",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                fontSize: "1rem",
                                padding: "0.75rem 1.25rem"
                            }}
                            cursor={{ fill: "#121212", opacity: 0.5 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#883cf3"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{
                                r: 8,
                                fill: "#fff",
                                stroke: "#883cf3",
                                strokeWidth: 3,
                                style: { opacity: 1 }
                            }}
                            animationDuration={600}
                        />
                    </LineChart>
                ) : (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#151515" vertical={false} horizontal={true} />
                        <XAxis dataKey="date" stroke="#cccccc" tick={{ fill: "#cccccc" }} />
                        <YAxis
                            stroke="#cccccc"
                            tick={{ fill: "#cccccc" }}
                            tickFormatter={formatYAxisTick}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "#121212",
                                borderRadius: 20,
                                border: "none",
                                color: "#fff",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                fontSize: "1rem",
                                padding: "0.75rem 1.25rem"
                            }}
                            cursor={{ fill: "#232323", opacity: 0.5 }}
                        />
                        <Bar
                            dataKey="value"
                            fill="#883cf3"
                            radius={[6, 6, 0, 0]}
                            animationDuration={600}
                        />
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}