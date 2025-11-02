# HTML Augmentation Guide: Forest Carbon Storage Documentation

## Purpose
This guide instructs how to augment the existing HTML presentation with detailed scientific information from the transcript, PPT descriptions, and supplementary materials to educate landscape professionals about carbon storage in urban forestry settings.

---

## Core Principles

### 1. Information Fidelity (90/10 Rule)
- **90% from provided sources**: Transcript, PPT slides, supplementary Grok data
- **10% supplementary**: Well-established scientific/industrial knowledge that directly supports provided information
- **NO deduction or inference** beyond what is explicitly stated
- When adding external knowledge, clearly mark it as "[Supplementary: Industry Standard]" or "[Supplementary: Scientific Consensus]"

### 2. Target Audience
- Landscape Designers
- Landscape Architects
- Horticulturists
- Arborists
- Urban Forestry Planners
- Environmental Consultants

---

## Augmentation Strategy

### Section 1: Enhanced Climate-Biodiversity Context

#### Add to "Climate-Biodiversity Crisis" Tab

**New Subsection: IPCC AR6 Detailed Impacts**

```html
<div class="card">
    <h3>🌡️ IPCC AR6 Assessment Report: Documented Ecosystem Impacts</h3>
    <p><strong>Source:</strong> Slide 1 - IPCC AR6 Synthesis Report (2023)</p>
    
    <!-- Use Chart.js for confidence levels visualization -->
    <canvas id="ipccImpactsChart" height="400"></canvas>
    
    <table class="data-table">
        <thead>
            <tr>
                <th>Impact Category</th>
                <th>Observed Changes</th>
                <th>Confidence</th>
                <th>Evidence Source</th>
            </tr>
        </thead>
        <tbody>
            <!-- Water & Food Production -->
            <tr>
                <td><strong>Physical Water Availability</strong></td>
                <td>Adverse changes in water availability patterns</td>
                <td><span class="badge badge-green">Very High ●●●</span></td>
                <td>IPCC AR6, Slide 1</td>
            </tr>
            <tr>
                <td><strong>Agricultural Crop Production</strong></td>
                <td>Reduced yields, altered growing seasons</td>
                <td><span class="badge badge-green">Very High ●●●</span></td>
                <td>IPCC AR6, Slide 1</td>
            </tr>
            <tr>
                <td><strong>Animal/Livestock Health & Productivity</strong></td>
                <td>Heat stress, disease spread, reduced productivity</td>
                <td><span class="badge badge-green">High ●●</span></td>
                <td>IPCC AR6, Slide 1</td>
            </tr>
            <tr>
                <td><strong>Fisheries/Aquaculture Production</strong></td>
                <td>Species distribution shifts, yield changes</td>
                <td><span class="badge badge-blue">Medium ●</span></td>
                <td>IPCC AR6, Slide 1</td>
            </tr>
            
            <!-- Health & Well-being -->
            <tr>
                <td><strong>Infectious Diseases</strong></td>
                <td>Expanded disease vector ranges</td>
                <td><span class="badge badge-green">High ●●</span></td>
                <td>IPCC AR6, Slide 1</td>
            </tr>
            <tr>
                <td><strong>Heat/Malnutrition/Wildfire Harm</strong></td>
                <td>Increased mortality and health impacts</td>
                <td><span class="badge badge-green">Very High ●●●</span></td>
                <td>IPCC AR6, Slide 1</td>
            </tr>
            <tr>
                <td><strong>Mental Health</strong></td>
                <td>Climate anxiety, displacement trauma</td>
                <td><span class="badge badge-green">High ●●</span></td>
                <td>IPCC AR6, Slide 1</td>
            </tr>
            <tr>
                <td><strong>Displacement</strong></td>
                <td>Climate-induced migration</td>
                <td><span class="badge badge-green">High ●●</span></td>
                <td>IPCC AR6, Slide 1</td>
            </tr>
            
            <!-- Infrastructure -->
            <tr>
                <td><strong>Inland Flooding & Damages</strong></td>
                <td>Increased frequency and severity</td>
                <td><span class="badge badge-green">High ●●</span></td>
                <td>IPCC AR6, Slide 1</td>
            </tr>
            <tr>
                <td><strong>Coastal Flood/Storm Damages</strong></td>
                <td>Storm surge intensification, erosion</td>
                <td><span class="badge badge-green">High ●●</span></td>
                <td>IPCC AR6, Slide 1</td>
            </tr>
            <tr>
                <td><strong>Economic Sector Damages</strong></td>
                <td>Tourism, fisheries, agriculture impacts</td>
                <td><span class="badge badge-blue">Medium ●</span></td>
                <td>IPCC AR6, Slide 1</td>
            </tr>
            <tr>
                <td><strong>Infrastructure Damages</strong></td>
                <td>Roads, buildings, utilities degradation</td>
                <td><span class="badge badge-green">High ●●</span></td>
                <td>IPCC AR6, Slide 1</td>
            </tr>
            
            <!-- Biodiversity -->
            <tr>
                <td><strong>Terrestrial Ecosystems</strong></td>
                <td>Structure changes, range shifts, seasonal timing</td>
                <td><span class="badge badge-green">Very High ●●●</span></td>
                <td>IPCC AR6, Slide 1</td>
            </tr>
            <tr>
                <td><strong>Freshwater Ecosystems</strong></td>
                <td>Structure changes, range shifts, seasonal timing</td>
                <td><span class="badge badge-green">High ●●</span></td>
                <td>IPCC AR6, Slide 1</td>
            </tr>
            <tr>
                <td><strong>Ocean Ecosystems</strong></td>
                <td>Structure changes, range shifts, seasonal timing</td>
                <td><span class="badge badge-green">Very High ●●●</span></td>
                <td>IPCC AR6, Slide 1</td>
            </tr>
        </tbody>
    </table>
    
    <div style="margin-top: 1.5rem; padding: 1.25rem; background: rgba(74, 222, 128, 0.1); border-radius: 8px;">
        <strong>IPCC Confidence Level Legend:</strong>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
            <li><strong>●●● Very High:</strong> Robust evidence, high agreement among studies</li>
            <li><strong>●● High:</strong> Consistent evidence across multiple studies</li>
            <li><strong>● Medium:</strong> Limited evidence or medium agreement</li>
        </ul>
    </div>
</div>

<script>
// Chart.js for IPCC Impacts Visualization
const ipccCtx = document.getElementById('ipccImpactsChart').getContext('2d');
new Chart(ipccCtx, {
    type: 'bar',
    data: {
        labels: [
            'Water Availability',
            'Crop Production', 
            'Livestock Health',
            'Fisheries',
            'Infectious Disease',
            'Heat/Malnutrition',
            'Mental Health',
            'Displacement',
            'Inland Flooding',
            'Coastal Flooding',
            'Economic Damages',
            'Infrastructure',
            'Terrestrial Ecosystems',
            'Freshwater Ecosystems',
            'Ocean Ecosystems'
        ],
        datasets: [{
            label: 'Confidence Level',
            data: [3, 3, 2, 1, 2, 3, 2, 2, 2, 2, 1, 2, 3, 2, 3], // Very High=3, High=2, Medium=1
            backgroundColor: [
                '#4ade80', '#4ade80', '#60a5fa', '#fbbf24',
                '#60a5fa', '#4ade80', '#60a5fa', '#60a5fa',
                '#60a5fa', '#60a5fa', '#fbbf24', '#60a5fa',
                '#4ade80', '#60a5fa', '#4ade80'
            ]
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        scales: {
            x: {
                title: { display: true, text: 'Confidence (3=Very High, 2=High, 1=Medium)' },
                max: 3,
                ticks: { stepSize: 1 }
            }
        },
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'IPCC AR6: Climate Change Impact Confidence Levels'
            }
        }
    }
});
</script>
```

---

### Section 2: WWF Living Planet Index Deep Dive

#### Add to "Climate-Biodiversity Crisis" Tab

```html
<div class="card">
    <h3>📉 WWF Living Planet Report 2024: Quantified Biodiversity Loss</h3>
    <p><strong>Source:</strong> Transcript + Supplementary Grok Data (WWF 2024)</p>
    
    <!-- Chart.js: Regional decline comparison -->
    <canvas id="wwfDeclineChart" height="300"></canvas>
    
    <div style="margin-top: 2rem;">
        <h4 style="color: #4ade80; margin-bottom: 1rem;">Global Wildlife Population Trends (1970-2020)</h4>
        
        <div style="background: rgba(220, 38, 38, 0.1); padding: 1.5rem; border-radius: 8px; border-left: 4px solid #dc2626; margin-bottom: 1.5rem;">
            <div style="font-size: 3rem; font-weight: 700; color: #dc2626;">-73%</div>
            <div style="font-weight: 600; margin-bottom: 0.5rem;">Average Global Decline (WWF Living Planet Index)</div>
            <div style="font-size: 0.875rem; color: #cbd5e0;">
                <strong>Methodology:</strong> Monitoring populations of 5,495 monitored species across vertebrates
            </div>
        </div>
        
        <table class="data-table">
            <thead>
                <tr>
                    <th>Region/Ecosystem</th>
                    <th>Population Decline (%)</th>
                    <th>Time Period</th>
                    <th>Source</th>
                </tr>
            </thead>
            <tbody>
                <tr style="background: rgba(220, 38, 38, 0.15);">
                    <td><strong>Latin America & Caribbean</strong></td>
                    <td><span style="color: #dc2626; font-weight: 700; font-size: 1.25rem;">-95%</span></td>
                    <td>1970-2020</td>
                    <td>WWF LPR 2024 (Grok)</td>
                </tr>
                <tr style="background: rgba(220, 38, 38, 0.15);">
                    <td><strong>Freshwater Species (Global)</strong></td>
                    <td><span style="color: #dc2626; font-weight: 700; font-size: 1.25rem;">-85%</span></td>
                    <td>1970-2020</td>
                    <td>WWF LPR 2024 (Grok)</td>
                </tr>
                <tr>
                    <td><strong>Global Average (All Vertebrates)</strong></td>
                    <td><span style="color: #dc2626; font-weight: 700;">-73%</span></td>
                    <td>1970-2020</td>
                    <td>WWF LPR 2024 (Transcript + Grok)</td>
                </tr>
                <tr>
                    <td><strong>Europe Freshwater (Historical Reference)</strong></td>
                    <td><span style="color: #f87171; font-weight: 700;">-55%</span></td>
                    <td>Earlier WWF Index</td>
                    <td>Transcript (Dr. Hau)</td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div style="margin-top: 1.5rem; padding: 1.25rem; background: rgba(251, 191, 36, 0.1); border-radius: 8px; border-left: 4px solid #fbbf24;">
        <div style="font-weight: 700; color: #fbbf24; margin-bottom: 0.5rem;">⚠️ Critical Update from Supplementary Data</div>
        <p style="margin: 0;">The transcript references a 17-30% decline from earlier indices. The 2024 WWF report reveals the crisis has <strong>accelerated significantly</strong>, with the current 73% average decline indicating biodiversity loss is outpacing previous projections. Freshwater ecosystems are experiencing the steepest losses at 85%.</p>
    </div>
</div>

<script>
// Chart.js: WWF Regional Decline Comparison
const wwfCtx = document.getElementById('wwfDeclineChart').getContext('2d');
new Chart(wwfCtx, {
    type: 'bar',
    data: {
        labels: ['Latin America\n& Caribbean', 'Freshwater\nSpecies', 'Global\nAverage', 'Europe\nFreshwater\n(Historical)'],
        datasets: [{
            label: 'Population Decline (%)',
            data: [-95, -85, -73, -55],
            backgroundColor: ['#dc2626', '#dc2626', '#f87171', '#fbbf24']
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                title: { display: true, text: 'Population Change (%)' },
                max: 0,
                min: -100
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'WWF Living Planet Index: Regional Wildlife Declines (1970-2020)'
            },
            legend: { display: false }
        }
    }
});
</script>
```

---

### Section 3: Forest Carbon Stock Data Visualization

#### Replace existing table in "Key Findings" tab with Chart.js visualization

```html
<div class="card">
    <h3>📊 Carbon Storage Performance by Vegetation Type</h3>
    <p><strong>Source:</strong> Slide 15 + Research Data</p>
    
    <!-- Dual-axis chart: Carbon Storage + Age -->
    <canvas id="carbonStorageChart" height="350"></canvas>
    
    <!-- Detailed data table below chart -->
    <table class="data-table" style="margin-top: 2rem;">
        <thead>
            <tr>
                <th>Vegetation Type</th>
                <th>Age Range (years)</th>
                <th>Above-Ground Biomass (Mg/ha)</th>
                <th>Carbon Storage (MgC/ha)</th>
                <th>Conversion Factor</th>
            </tr>
        </thead>
        <tbody>
            <tr style="background: rgba(74, 222, 128, 0.15);">
                <td><strong>Plantation</strong></td>
                <td>50-80</td>
                <td>354.22</td>
                <td><span style="color: #4ade80; font-weight: 700;">166.48</span></td>
                <td>0.47 (IPCC)</td>
            </tr>
            <tr style="background: rgba(74, 222, 128, 0.15);">
                <td><strong>Fung Shui Wood</strong></td>
                <td>>400</td>
                <td>346.85</td>
                <td><span style="color: #4ade80; font-weight: 700;">163.02</span></td>
                <td>0.47 (IPCC)</td>
            </tr>
            <tr>
                <td><strong>Secondary Forest</strong></td>
                <td>40-80</td>
                <td>164.34</td>
                <td><span style="color: #60a5fa; font-weight: 700;">77.24</span></td>
                <td>0.47 (IPCC)</td>
            </tr>
            <tr>
                <td><strong>Restoration Forest</strong></td>
                <td><20</td>
                <td>78.16</td>
                <td><span style="color: #fbbf24; font-weight: 700;">36.73</span></td>
                <td>0.47 (IPCC)</td>
            </tr>
            <tr>
                <td><strong>Tall Shrubland</strong></td>
                <td>10-30</td>
                <td>58.91</td>
                <td><span style="color: #f87171; font-weight: 700;">22.69</span></td>
                <td>0.47 (IPCC)</td>
            </tr>
        </tbody>
    </table>
    
    <div style="margin-top: 1.5rem; padding: 1.25rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
        <strong>Data Source Notes:</strong>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
            <li>All values from Slide 15: "Average Above-ground Biomass and Carbon Storage of Different Forest Types"</li>
            <li><strong>Conversion:</strong> Carbon (MgC/ha) = AGB (Mg/ha) × 0.47 (IPCC standard)</li>
            <li><strong>Unit Clarification:</strong> Mg/ha (Megagram per hectare) = Metric tonne per hectare</li>
            <li><strong>Note on Slide 16 Data:</strong> Listed as "166.5 MgC/ha" but labeled "AGB" — this is the carbon storage value, not total biomass</li>
        </ul>
    </div>
</div>

<script>
// Chart.js: Carbon Storage Comparison
const carbonCtx = document.getElementById('carbonStorageChart').getContext('2d');
new Chart(carbonCtx, {
    type: 'bar',
    data: {
        labels: [
            'Plantation\n(50-80 yrs)',
            'Fung Shui Wood\n(>400 yrs)',
            'Secondary Forest\n(40-80 yrs)',
            'Restoration Forest\n(<20 yrs)',
            'Tall Shrubland\n(10-30 yrs)'
        ],
        datasets: [
            {
                label: 'Above-Ground Biomass (Mg/ha)',
                data: [354.22, 346.85, 164.34, 78.16, 58.91],
                backgroundColor: 'rgba(74, 222, 128, 0.6)',
                yAxisID: 'y'
            },
            {
                label: 'Carbon Storage (MgC/ha)',
                data: [166.48, 163.02, 77.24, 36.73, 22.69],
                backgroundColor: 'rgba(34, 197, 94, 0.9)',
                yAxisID: 'y'
            }
        ]
    },
    options: {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Mass per Hectare (Mg/ha or MgC/ha)' }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Hong Kong Forest Carbon Storage by Vegetation Type (Field Measurements)'
            }
        }
    }
});
</script>
```

---

### Section 4: Large Tree Contribution Analysis

#### Add Chart.js visualization for Top 1% analysis

```html
<div class="card">
    <h3>🎯 Disproportionate Carbon Storage in Large Trees</h3>
    <p><strong>Source:</strong> Slide 18 + Transcript Analysis</p>
    
    <canvas id="largeTreeChart" height="300"></canvas>
    
    <table class="data-table" style="margin-top: 2rem;">
        <thead>
            <tr>
                <th>Vegetation Type</th>
                <th>Top 1% AGB (kg)</th>
                <th>Total Plot AGB (kg)</th>
                <th>Top 1% Contribution (%)</th>
                <th>Source</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Shrubland</strong></td>
                <td>5,263.6</td>
                <td>25,922</td>
                <td><span style="color: #60a5fa; font-weight: 700;">20%</span></td>
                <td>Slide 18</td>
            </tr>
            <tr>
                <td><strong>KFBG</strong></td>
                <td>27,576</td>
                <td>69,785</td>
                <td><span style="color: #fbbf24; font-weight: 700;">40%</span></td>
                <td>Slide 18</td>
            </tr>
            <tr>
                <td><strong>Reforestation</strong></td>
                <td>10,231</td>
                <td>39,637</td>
                <td><span style="color: #fbbf24; font-weight: 700;">26%</span></td>
                <td>Slide 18</td>
            </tr>
            <tr>
                <td><strong>Secondary</strong></td>
                <td>22,989</td>
                <td>65,109</td>
                <td><span style="color: #fbbf24; font-weight: 700;">35%</span></td>
                <td>Slide 18</td>
            </tr>
            <tr>
                <td><strong>TPK</strong></td>
                <td>30,465</td>
                <td>92,662</td>
                <td><span style="color: #dc2626; font-weight: 700;">33%</span></td>
                <td>Slide 18</td>
            </tr>
            <tr style="background: rgba(220, 38, 38, 0.1);">
                <td><strong>FSW (Fung Shui Wood)</strong></td>
                <td>71,458</td>
                <td>138,741</td>
                <td><span style="color: #dc2626; font-weight: 700; font-size: 1.1rem;">52%</span></td>
                <td>Slide 18</td>
            </tr>
            <tr>
                <td><strong>Plantation</strong></td>
                <td>50,730</td>
                <td>141,687</td>
                <td><span style="color: #dc2626; font-weight: 700;">36%</span></td>
                <td>Slide 18</td>
            </tr>
        </tbody>
    </table>
    
    <div style="margin-top: 1.5rem; padding: 1.25rem; background: rgba(74, 222, 128, 0.1); border-radius: 8px; border-left: 4px solid #4ade80;">
        <div style="font-weight: 700; color: #4ade80; margin-bottom: 0.5rem;">Key Findings (Direct Quote from Slide 18):</div>
        <p style="margin-bottom: 0.5rem;">"The top 1% large-sized individuals accounted for <strong>20-52% of plot level biomass</strong> of all vegetation types."</p>
        <p style="margin: 0; font-style: italic;">"Large trees play an important role in carbon sequestration" — Slide 18 conclusion</p>
    </div>
    
    <div style="margin-top: 1rem; padding: 1.25rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
        <strong>Transcript Context (Dr. Hau):</strong>
        <p style="margin-top: 0.5rem; font-style: italic;">"In this study, any diameter that are larger than 40 centimeter we call them large stems. And they store much more carbon than small stems."</p>
        <p style="margin-top: 0.5rem;"><strong>Definition:</strong> Large stem = DBH ≥ 40 cm (study criteria)</p>
    </div>
</div>

<script>
// Chart.js: Top 1% Contribution Visualization
const largeTreeCtx = document.getElementById('largeTreeChart').getContext('2d');
new Chart(largeTreeCtx, {
    type: 'bar',
    data: {
        labels: ['Shrubland', 'KFBG', 'Reforestation', 'Secondary', 'TPK', 'FSW', 'Plantation'],
        datasets: [{
            label: 'Top 1% Trees Contribution to Total Biomass (%)',
            data: [20, 40, 26, 35, 33, 52, 36],
            backgroundColor: [
                '#60a5fa', // Shrubland
                '#fbbf24', // KFBG
                '#fbbf24', // Reforestation
                '#fbbf24', // Secondary
                '#dc2626', // TPK
                '#dc2626', // FSW (highest)
                '#dc2626'  // Plantation
            ]
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                title: { display: true, text: 'Biomass Contribution (%)' },
                max: 60,
                ticks: { stepSize: 10 }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Carbon Storage by Largest 1% of Trees (Plot-Level Analysis)'
            },
            legend: { display: false }
        }
    }
});
</script>
```

---

### Section 5: Global Comparison with ForestGEO Data

#### Add Chart.js visualization for Slide 19 data

```html
<div class="card">
    <h3>🌍 Hong Kong's Forests in Global Context (ForestGEO Network)</h3>
    <p><strong>Source:</strong> Slide 19 (Lutz et al. 2018, <em>Global Ecology and Biogeography</em>)</p>
    
    <canvas id="globalComparisonChart" height="350"></canvas>
    
    <table class="data-table" style="margin-top: 2rem;">
        <thead>
            <tr>
                <th>Plot Location</th>
                <th>Large-Diameter Threshold (cm)</th>
                <th>Density (stems/ha)</th>
                <th>Biomass (Mg/ha)</th>
                <th>Total Species (n)</th>
                <th>Large-Diam Species (n)</th>
                <th>Large-Diam Richness (%)</th>
                <th>Biomass of Top 1% (%)</th>
                <th>Density >60cm DBH (stems/ha)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Heishiding</td>
                <td>34.5</td>
                <td>5277 (±706)</td>
                <td>149 (±27)</td>
                <td>213</td>
                <td>59</td>
                <td>28</td>
                <td>43</td>
                <td>12</td>
            </tr>
            <tr>
                <td>Wabikon¹</td>
                <td>31.1</td>
                <td>1692 (±1017)</td>
                <td>111 (±14)</td>
                <td>31</td>
                <td>15</td>
                <td>48</td>
                <td>17</td>
                <td>1</td>
            </tr>
            <tr>
                <td>Gutianshan</td>
                <td>31.0</td>
                <td>5833 (±1580)</td>
                <td>185 (±27)</td>
                <td>159</td>
                <td>40</td>
                <td>25</td>
                <td>34</td>
                <td>2</td>
            </tr>
            <tr>
                <td>Ilha do Cardoso</td>
                <td>31.0</td>
                <td>4660 (±578)</td>
                <td>148 (±17)</td>
                <td>135</td>
                <td>43</td>
                <td>32</td>
                <td>41</td>
                <td>7</td>
            </tr>
            <tr>
                <td>Yasuni</td>
                <td>29.1</td>
                <td>5834 (±692)</td>
                <td>261 (±48)</td>
                <td>1075</td>
                <td>343</td>
                <td>32</td>
                <td>50</td>
                <td>8</td>
            </tr>
            <tr style="background: rgba(74, 222, 128, 0.15);">
                <td><strong>Hong Kong¹</strong></td>
                <td><strong>28.6</strong></td>
                <td><strong>5860 (±1056)</strong></td>
                <td><strong>142 (±20)</strong></td>
                <td><strong>172</strong></td>
                <td><strong>43</strong></td>
                <td><strong>25</strong></td>
                <td><strong>39</strong></td>
                <td><strong>3</strong></td>
            </tr>
            <tr>
                <td>Lanjenchi</td>
                <td>17.2</td>
                <td>12075 (±2795)</td>
                <td>113 (±7)</td>
                <td>128</td>
                <td>72</td>
                <td>56</td>
                <td>29</td>
                <td>1</td>
            </tr>
            <tr>
                <td>Mpala</td>
                <td>10.0</td>
                <td>2963 (±2902)</td>
                <td>13 (±8)</td>
                <td>68</td>
                <td>35</td>
                <td>51</td>
                <td>30</td>
                <td>0</td>
            </tr>
            <tr>
                <td>Scotty Creek</td>
                <td>7.6</td>
                <td>4138 (±3407)</td>
                <td>22 (±11)</td>
                <td>11</td>
                <td>7</td>
                <td>64</td>
                <td>15</td>
                <td>0</td>
            </tr>
            <tr>
                <td>Palamanui</td>
                <td>2.5</td>
                <td>8205 (±1084)</td>
                <td>30 (±5)</td>
                <td>16</td>
                <td>11</td>
                <td>69</td>
                <td>13</td>
                <td>0</td>
            </tr>
        </tbody>
    </table>
    
    <div style="margin-top: 1.5rem; padding: 1.25rem; background: rgba(74, 222, 128, 0.1); border-radius: 8px; border-left: 4px solid #4ade80;">
        <div style="font-weight: 700; color: #4ade80; margin-bottom: 0.5rem;">Dr. Hau's Transcript Analysis:</div>
        <p style="margin-bottom: 0.5rem; font-style: italic;">"The above ground biomass (not counting underground and soil carbon) of the secondary forest in Tai Po Kau is: <strong>142 ± 20 Mg/ha</strong>"</p>
        <p style="margin-bottom: 0.5rem;"><strong>Context:</strong> "The two PLs one in Wuhan and one in H which is in southern China. And we actually storing similar amount of like the one in Hong Kong, about 160 tons per hectare."</p>
        <p style="margin: 0;"><strong>Conclusion:</strong> "Despite Hong being small and the forests are not impressive, we do have forest growing to cover."</p>
    </div>
    
    <div style="margin-top: 1rem; padding: 1.25rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
        <strong>Table Notes (from Slide 19):</strong>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
            <li>¹ Superscript indicates temperate/boreal sites (Hong Kong, Wabikon)</li>
            <li>SD = Standard Deviation (shown in parentheses)</li>
            <li>All data from 48 ForestGEO plots worldwide (standardized methodology)</li>
            <li><strong>Citation:</strong> Lutz et al. 2018. Global importance of large diameter trees. <em>Global Ecology and Biogeography</em> 27(7):849-864.</li>
        </ul>
    </div>
</div>

<script>
// Chart.js: Global Forest Biomass Comparison
const globalCtx = document.getElementById('globalComparisonChart').getContext('2d');
new Chart(globalCtx, {
    type: 'bar',
    data: {
        labels: [
            'Heishiding\n(China)',
            'Wabikon¹',
            'Gutianshan\n(China)',
            'Ilha do Cardoso\n(Brazil)',
            'Yasuni\n(Ecuador)',
            'Hong Kong¹\n(Tai Po Kau)',
            'Lanjenchi\n(Taiwan)',
            'Mpala\n(Kenya)',
            'Scotty Creek\n(Canada)',
            'Palamanui\n(Hawaii)'
        ],
        datasets: [{
            label: 'Above-Ground Biomass (Mg/ha)',
            data: [149, 111, 185, 148, 261, 142, 113, 13, 22, 30],
            backgroundColor: [
                '#60a5fa', '#60a5fa', '#60a5fa', '#60a5fa', '#60a5fa',
                '#4ade80', // Hong Kong highlighted
                '#60a5fa', '#fbbf24', '#fbbf24', '#fbbf24'
            ]
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                title: { display: true, text: 'Biomass (Mg/ha)' },
                beginAtZero: true
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Forest Biomass Comparison: Hong Kong vs. Global ForestGEO Sites'
            },
            legend: { display: false }
        }
    }
});
</script>
```

---

### Section 6: Wood Density by Family

#### Add Chart.js for wood density visualization

```html
<div class="card">
    <h3>🔬 Wood Density Analysis by Botanical Family</h3>
    <p><strong>Source:</strong> Transcript + Slide 20 Species List</p>
    
    <canvas id="woodDensityChart" height="250"></canvas>
    
    <div style="margin-top: 2rem;">
        <h4 style="color: #4ade80; margin-bottom: 1rem;">High vs. Low Wood Density Families</h4>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            <div style="background: rgba(74, 222, 128, 0.1); padding: 1.5rem; border-radius: 8px; border-left: 4px solid #4ade80;">
                <div style="font-weight: 700; color: #4ade80; margin-bottom: 0.75rem;">✅ High Wood Density Families</div>
                <p style="margin-bottom: 0.75rem; font-size: 0.875rem;"><em>Superior carbon storage + typhoon resistance</em></p>
                <ul style="margin-left: 1.5rem; font-size: 0.95rem;">
                    <li><strong>Fabaceae (豆科)</strong> — Legume family</li>
                    <li><strong>Myrtaceae (桃金娘科)</strong> — Myrtle family (Syzygium spp.)</li>
                    <li><strong>Fagaceae (殼斗科)</strong> — Oak family (Castanopsis, Cyclobalanopsis, Lithocarpus)</li>
                    <li><strong>Lauraceae (樟科)</strong> — Laurel family (Cinnamomum, Machilus, Litsea)</li>
                </ul>
            </div>
            
            <div style="background: rgba(251, 191, 36, 0.1); padding: 1.5rem; border-radius: 8px; border-left: 4px solid #fbbf24;">
                <div style="font-weight: 700; color: #fbbf24; margin-bottom: 0.75rem;">⚠️ Lower Wood Density Families</div>
                <p style="margin-bottom: 0.75rem; font-size: 0.875rem;"><em>Fast-growing pioneers, lower structural strength</em></p>
                <ul style="margin-left: 1.5rem; font-size: 0.95rem;">
                    <li><strong>Moraceae (桑科)</strong> — Mulberry family (Ficus spp.)</li>
                    <li><strong>Ulmaceae (榆科)</strong> — Elm family (Celtis, Aphananthe)</li>
                    <li><strong>Euphorbiaceae (大戟科)</strong> — Spurge family (Endospermum)</li>
                </ul>
            </div>
        </div>
    </div>
    
    <div style="margin-top: 1.5rem; padding: 1.25rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
        <strong>Transcript Evidence (Dr. Hau):</strong>
        <p style="margin-top: 0.5rem; font-style: italic;">"We also have species that are very good in storing carbon, but they are not very good on the other aspects."</p>
        <p style="margin-top: 0.5rem; font-style: italic;">"These families have very good wood density. The higher the wood density, the more carbon is stored."</p>
        <p style="margin-top: 0.5rem; font-style: italic;">"Trees with lower density usually have more grit or wood. They're not as effective during typhoon time to stand up against the wind."</p>
    </div>
    
    <div style="margin-top: 1rem; padding: 1.25rem; background: rgba(60, 130, 246, 0.1); border-radius: 8px; border-left: 4px solid #60a5fa;">
        <div style="font-weight: 700; color: #60a5fa; margin-bottom: 0.5rem;">[Supplementary: Industry Standard]</div>
        <p style="margin: 0; font-size: 0.9rem;">Wood density (measured in g/cm³) typically ranges from 0.3 (very light softwoods) to 1.0+ (hardwoods like ironwood). In tropical/subtropical forestry, species with density >0.6 g/cm³ are considered structurally robust. This aligns with Dr. Hau's observation about typhoon resistance in Hong Kong's climate.</p>
    </div>
</div>

<script>
// Chart.js: Wood Density Family Comparison (Conceptual - based on transcript categories)
const densityCtx = document.getElementById('woodDensityChart').getContext('2d');
new Chart(densityCtx, {
    type: 'bar',
    data: {
        labels: [
            'Fabaceae\n(豆科)',
            'Myrtaceae\n(桃金娘科)',
            'Fagaceae\n(殼斗科)',
            'Lauraceae\n(樟科)',
            'Moraceae\n(桑科)',
            'Ulmaceae\n(榆科)',
            'Euphorbiaceae\n(大戟科)'
        ],
        datasets: [{
            label: 'Relative Wood Density Category',
            data: [3, 3, 3, 3, 1, 1, 1], // High=3, Low=1 (categorical representation)
            backgroundColor: [
                '#4ade80', '#4ade80', '#4ade80', '#4ade80',
                '#fbbf24', '#fbbf24', '#fbbf24'
            ]
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                title: { display: true, text: 'Wood Density Category (3=High, 1=Lower)' },
                max: 3.5,
                ticks: { stepSize: 1, callback: function(value) {
                    if (value === 3) return 'High';
                    if (value === 1) return 'Lower';
                    return '';
                }}
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Wood Density Categories by Botanical Family (Hong Kong Native Trees)'
            },
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.parsed.y === 3 ? 'High Density Family' : 'Lower Density Family';
                    }
                }
            }
        }
    }
});
</script>
```

---

### Section 7: Restoration Forest Case Study (Hung Lung Hang)

#### Add detailed breakdown with Chart.js

```html
<div class="card">
    <h3>🌟 Case Study: Hung Lung Hang Reforestation Site (25 Years)</h3>
    <p><strong>Source:</strong> Slide 17 + Transcript Analysis</p>
    
    <canvas id="restorationProgressChart" height="280"></canvas>
    
    <div style="margin-top: 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem;">
        <div style="background: rgba(74, 222, 128, 0.1); padding: 1.5rem; border-radius: 8px; border: 2px solid #4ade80; text-align: center;">
            <div style="font-size: 2.5rem; font-weight: 700; color: #4ade80;">25</div>
            <div style="color: #cbd5e0; margin-bottom: 0.5rem;">Years Old</div>
            <div style="font-size: 0.875rem; opacity: 0.8;">Site Age</div>
        </div>
        <div style="background: rgba(74, 222, 128, 0.1); padding: 1.5rem; border-radius: 8px; border: 2px solid #4ade80; text-align: center;">
            <div style="font-size: 2.5rem; font-weight: 700; color: #4ade80;">15m</div>
            <div style="color: #cbd5e0; margin-bottom: 0.5rem;">Canopy Height</div>
            <div style="font-size: 0.875rem; opacity: 0.8;">Comparable to secondary forest</div>
        </div>
        <div style="background: rgba(74, 222, 128, 0.1); padding: 1.5rem; border-radius: 8px; border: 2px solid #4ade80; text-align: center;">
            <div style="font-size: 2.5rem; font-weight: 700; color: #4ade80;">25+</div>
            <div style="color: #cbd5e0; margin-bottom: 0.5rem;">Native Species</div>
            <div style="font-size: 0.875rem; opacity: 0.8;">High biodiversity</div>
        </div>
        <div style="background: rgba(74, 222, 128, 0.1); padding: 1.5rem; border-radius: 8px; border: 2px solid #4ade80; text-align: center;">
            <div style="font-size: 2.5rem; font-weight: 700; color: #4ade80;">56</div>
            <div style="color: #cbd5e0; margin-bottom: 0.5rem;">MgC/ha</div>
            <div style="font-size: 0.875rem; opacity: 0.8;">Carbon storage (vs 77 in 40-80yr secondary)</div>
        </div>
    </div>
    
    <div style="margin-top: 1.5rem; padding: 1.25rem; background: rgba(74, 222, 128, 0.1); border-radius: 8px; border-left: 4px solid #4ade80;">
        <div style="font-weight: 700; color: #4ade80; margin-bottom: 0.5rem;">Transcript Analysis (Dr. Hau):</div>
        <p style="margin-bottom: 0.5rem; font-style: italic;">"The 25-year-old Douglang [Hung Lung Hang]. That site is 25 years old. Currently the canopy is 15 meter which is quite near to a natural secondary forest."</p>
        <p style="margin-bottom: 0.5rem; font-style: italic;">"The above ground Biomass stored is <strong>56 tons of carbon per hectare</strong>. Based on these deforestation plots. And we as secondary forest, you're talking about 77."</p>
        <p style="margin-bottom: 0.5rem; font-style: italic;">"So in 25 years from bare land to these forests, the carbon stored is actually <strong>approaching the secondary forest</strong> we have in Hong Kong."</p>
        <p style="margin: 0; font-style: italic;">"I believe give it 10 more years, this reforestation crop will catch up with the natural St. Louis Forest [secondary forest]."</p>
    </div>
    
    <div style="margin-top: 1rem; padding: 1.25rem; background: rgba(59, 130, 246, 0.1); border-radius: 8px; border-left: 4px solid #60a5fa;">
        <div style="font-weight: 700; color: #60a5fa; margin-bottom: 0.75rem;">Featured Large Stem: <em>Cordia dichotoma</em> (破布木)</div>
        <p style="margin-bottom: 0.5rem;"><strong>Slide 17 Data:</strong></p>
        <ul style="margin-left: 1.5rem;">
            <li>DBH achieved: <strong>42 cm in 25 years</strong></li>
            <li>Qualifies as "large stem" (study definition: DBH ≥ 40 cm)</li>
            <li>Ecological value: Common in village environments, culturally significant</li>
        </ul>
        <p style="margin-top: 0.75rem; font-style: italic;">"We do have species in Hong Kong which can reach up to these large stem size in a short period of time. 25 years old tree is actually not long special." — Dr. Hau (Transcript)</p>
    </div>
    
    <div style="margin-top: 1rem; padding: 1.25rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
        <strong>Design Implications for Landscape Architects:</strong>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
            <li>Native species plantings can achieve secondary forest carbon levels within 25-35 years</li>
            <li>Select fast-growing large-stem species (e.g., <em>Cordia dichotoma</em>) for carbon acceleration</li>
            <li>Complex multi-species design (25+ species) provides biodiversity co-benefits</li>
            <li>15m canopy height is achievable in 25 years with proper species selection and site management</li>
        </ul>
    </div>
</div>

<script>
// Chart.js: Restoration Progress vs. Secondary Forest
const restorationCtx = document.getElementById('restorationProgressChart').getContext('2d');
new Chart(restorationCtx, {
    type: 'line',
    data: {
        labels: ['0 yrs\n(Bare Land)', '10 yrs', '25 yrs\n(Current)', '35 yrs\n(Projected)', '50 yrs\n(Secondary Forest Avg.)'],
        datasets: [
            {
                label: 'Hung Lung Hang Reforestation (MgC/ha)',
                data: [0, null, 56, 77, 77], // Projected to match secondary by year 35
                borderColor: '#4ade80',
                backgroundColor: 'rgba(74, 222, 128, 0.1)',
                tension: 0.3,
                fill: true
            },
            {
                label: 'Typical Secondary Forest Benchmark',
                data: [null, null, null, null, 77],
                borderColor: '#60a5fa',
                borderDash: [5, 5],
                pointRadius: 5
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                title: { display: true, text: 'Carbon Storage (MgC/ha)' },
                beginAtZero: true,
                max: 85
            },
            x: {
                title: { display: true, text: 'Time Since Planting' }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Reforestation Carbon Accumulation Trajectory (Hung Lung Hang Case Study)'
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: 77,
                        yMax: 77,
                        borderColor: '#60a5fa',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            content: 'Secondary Forest Benchmark (77 MgC/ha)',
                            enabled: true,
                            position: 'start'
                        }
                    }
                }
            }
        }
    }
});
</script>
```

---

## Chart.js Integration Requirements

### 1. Add Chart.js Library

Insert before closing `</head>` tag:

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

### 2. Global Chart Styling

Add to `<style>` section:

```css
canvas {
    max-width: 100%;
    height: auto !important;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    padding: 1rem;
}

@media print {
    canvas {
        page-break-inside: avoid;
    }
}
```

---

## Data Presentation Standards

### Rule 1: Source Attribution
Every data point must cite its source:
- `"Source: Slide X"` for PPT data
- `"Source: Transcript (Dr. Hau)"` for spoken content
- `"Source: Grok Supplementary Data (WWF 2024)"` for external verification
- `"[Supplementary: Scientific Consensus]"` for added context (max 10%)

### Rule 2: Direct Quotes
Use italics for verbatim transcript quotes:
```html
<p style="font-style: italic;">"[Exact quote from transcript]" — Dr. Hau</p>
```

### Rule 3: Numerical Precision
- Preserve exact numbers from sources (e.g., 354.22, not "about 354")
- Include error margins when provided (e.g., 142 ± 20 Mg/ha)
- Use consistent units as in original sources

### Rule 4: Chart Data Integrity
- Chart data must exactly match source tables
- No interpolation unless explicitly stated as "[Projected]" or "[Estimated]"
- Color-code sources: Green = Slide data, Blue = Transcript, Amber = Supplementary

---

## Supplementary Information Guidelines (10% Rule)

### Permitted Additions (with clear labeling):

1. **IPCC Standards** (already in transcript):
   - 47% carbon content conversion
   - Molecular weight ratios (C vs CO₂)

2. **Industry-Standard Definitions**:
   - Wood density ranges (0.3-1.0 g/cm³)
   - DBH measurement protocols
   - Allometric equation applications

3. **ForestGEO Network Context**:
   - Standardized monitoring protocols (referenced in Slide 19)
   - Global plot network scope

4. **Hong Kong Climate Context** (supporting transcript):
   - Typhoon frequency (supports wood density discussion)
   - Subtropical classification

### Prohibited Additions:
- ❌ Carbon offset pricing/markets not discussed in sources
- ❌ Specific government policy details beyond what Dr. Hau mentioned
- ❌ Species lists beyond Slide 20's 30 species (10 per size category)
- ❌ Biodiversity metrics not in slides/transcript
- ❌ Soil carbon data (explicitly noted as outside study scope)

---

## Professional Audience Adaptations

### For Landscape Architects:
- Emphasize design applications of species lists (Slide 20)
- Highlight canopy height data (15m in 25 years)
- Note spatial requirements (20m × 20m plot scale)

### For Arborists:
- Focus on DBH thresholds (≥40 cm = large stem)
- Wood density implications for structural integrity
- Typhoon resistance correlation with density

### For Horticulturists:
- Species-specific growth rates (<em>Cordia dichotoma</em> case)
- Native species propagation potential
- Multi-species design strategies (25+ species mix)

### For Urban Foresters:
- Carbon storage per hectare benchmarks
- Plantation vs. native restoration trade-offs
- Long-term monitoring protocols (permanent plots)

---

## Quality Control Checklist

Before publishing augmented HTML:

- [ ] Every data table links to Slide # or Transcript quote
- [ ] All Chart.js datasets match source numbers exactly
- [ ] Supplementary content <10% of total and clearly labeled
- [ ] No inference/deduction beyond stated information
- [ ] Scientific names italicized per nomenclature standards
- [ ] Chinese names match Slide 20 exactly
- [ ] All units consistent with sources (Mg/ha, MgC/ha, kg, cm)
- [ ] Error margins preserved where provided (±SD)
- [ ] Direct quotes in italics with attribution
- [ ] Charts print-friendly and accessible

---

## Example: Prohibited vs. Permitted Augmentation

### ❌ PROHIBITED (Inference/Deduction):
```html
<p>Based on the 73% biodiversity decline, Hong Kong should allocate $50M annually 
to forest restoration to meet CBD targets by 2030.</p>
```
**Why:** Financial figures and specific timelines not in sources.

### ✅ PERMITTED (Direct from Sources + Minimal Context):
```html
<p><strong>WWF Living Planet Report 2024:</strong> Global wildlife populations declined 
73% (1970-2020). <em>Dr. Hau noted: "When we lose more biodiversity, we destroy more 
wetland, forest, ecosystem, we actually contribute to more severe climate change."</em></p>

<p style="margin-top: 0.5rem;">[Supplementary: Scientific Consensus] The CBD's Global 
Biodiversity Framework Target 2 requires restoring 30% of degraded ecosystems by 2030, 
which Dr. Hau mentioned as applicable to Hong Kong's 40% degraded grasslands/shrublands.</p>
```
**Why:** Combines source data (WWF, transcript quote, CBD target mentioned by Dr. Hau) 
with minimal clarification (<10% supplementary).

---

## Final Notes

1. **Prioritize Slide Data**: When transcript conflicts with slides, use slide numbers as primary source
2. **Preserve Scientific Rigor**: Don't round complex figures (e.g., 0.976 exponent in allometric equation)
3. **Visual Hierarchy**: Use Chart.js for quantitative comparisons, tables for detailed reference
4. **Accessibility**: All charts must have table equivalents for screen readers
5. **Print Optimization**: Ensure charts render clearly in grayscale for printed reports

This documentation ensures the augmented HTML remains a **faithful scientific communication tool** grounded in Dr. Hau's research while providing professional context for landscape industry applications.