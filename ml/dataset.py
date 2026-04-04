"""
dataset.py
----------
Synthetic labeled dataset for job-candidate matcher evaluation.

Design principles:
1. DIVERSITY — 10 candidates across different domains (ML, frontend, backend,
   devops, design, data engineering, mobile, security, embedded, product).
2. HARD NEGATIVES — each candidate's job pool includes jobs that share
   surface-level keywords but are genuinely wrong matches. This is what
   separates a real eval from a toy one. Example: a "Python Data Analyst"
   and a "Python ML Engineer" share the keyword Python, but are different
   roles — the matcher must distinguish them semantically.
3. REALISTIC TEXT — profiles and job descriptions are written the way real
   people write them, not as clean keyword lists.
4. GROUND TRUTH — relevant_job_ids are hand-labeled conservatively.
   When in doubt, a job is NOT labeled relevant.

This dataset is imported by evaluate.py. Do not run this file directly.
"""

EVAL_DATA = [

    # ── Candidate 1: ML Engineer ──────────────────────────────────────────────
    {
        "candidate": {
            "candidate_id": "c001",
            "name": "Ananya Rao",
            "skills": ["Python", "Machine Learning", "TensorFlow", "Scikit-learn", "SQL", "Pandas"],
            "experience": "2 years as ML engineer at a fintech startup. Built fraud detection models, "
                          "credit risk classifiers, and a real-time anomaly detection pipeline.",
            "education": "B.Tech Computer Science, NIT Surathkal",
            "preferred_roles": ["ML Engineer", "Data Scientist"],
            "bio": "I love turning messy data into reliable models. Comfortable with full ML lifecycle "
                   "from data cleaning to model serving.",
        },
        "jobs": [
            {
                "job_id": "j_ml_01",
                "title": "Machine Learning Engineer",
                "company": "TechCorp",
                "description": "Design, train, and deploy ML models for personalization and fraud detection. "
                               "Work with large-scale data pipelines and serve models in production.",
                "required_skills": ["Python", "TensorFlow", "MLOps", "SQL"],
                "experience_required": "1-3 years",
            },
            {
                "job_id": "j_ml_02",
                "title": "Data Scientist",
                "company": "AnalyticsHub",
                "description": "Work with business teams to solve problems using statistical modeling, "
                               "A/B testing, and predictive analytics. Python and SQL required.",
                "required_skills": ["Python", "SQL", "Pandas", "Statistics", "Scikit-learn"],
                "experience_required": "1-4 years",
            },
            {
                "job_id": "j_ml_03",
                "title": "AI Research Intern",
                "company": "DeepMind Labs",
                "description": "Research on deep learning architectures, NLP, and computer vision. "
                               "Publish findings, implement paper reproductions.",
                "required_skills": ["Python", "PyTorch", "Research", "Linear Algebra"],
                "experience_required": "0-2 years",
            },
            # Hard negatives below — share Python/data keywords but wrong fit
            {
                "job_id": "j_ml_hn1",
                "title": "Data Analyst",
                "company": "RetailCo",
                "description": "Create dashboards and reports using Excel, SQL, and Tableau. "
                               "Analyze sales data and present findings to stakeholders.",
                "required_skills": ["SQL", "Excel", "Tableau", "PowerPoint"],
                "experience_required": "1-2 years",
            },
            {
                "job_id": "j_ml_hn2",
                "title": "Backend Python Developer",
                "company": "WebStartup",
                "description": "Build REST APIs using Django and PostgreSQL. No ML involved. "
                               "Focus on clean architecture and API performance.",
                "required_skills": ["Python", "Django", "PostgreSQL", "REST APIs"],
                "experience_required": "2+ years",
            },
            {
                "job_id": "j_ml_hn3",
                "title": "Frontend Developer",
                "company": "DesignStudio",
                "description": "Build React UIs. Strong CSS and TypeScript skills required.",
                "required_skills": ["React", "TypeScript", "CSS", "Figma"],
                "experience_required": "2+ years",
            },
        ],
        "relevant_job_ids": ["j_ml_01", "j_ml_02", "j_ml_03"],
    },

    # ── Candidate 2: Frontend Developer ──────────────────────────────────────
    {
        "candidate": {
            "candidate_id": "c002",
            "name": "Rohan Mehta",
            "skills": ["React", "TypeScript", "Node.js", "GraphQL", "Tailwind CSS", "Jest"],
            "experience": "3 years frontend developer. Built e-commerce platforms and SaaS dashboards. "
                          "Led a team of 2 junior devs. Strong focus on performance and accessibility.",
            "education": "BCA, Pune University",
            "preferred_roles": ["Frontend Developer", "Full Stack Developer"],
        },
        "jobs": [
            {
                "job_id": "j_fe_01",
                "title": "Senior Frontend Engineer",
                "company": "ProductCo",
                "description": "Lead frontend development in React and TypeScript. Own component libraries, "
                               "write tests, and mentor junior developers.",
                "required_skills": ["React", "TypeScript", "Testing", "CSS"],
                "experience_required": "3+ years",
            },
            {
                "job_id": "j_fe_02",
                "title": "Full Stack Developer",
                "company": "StartupXYZ",
                "description": "Build features end-to-end using React, Node.js, and MongoDB. "
                               "Work directly with founders in a fast-paced environment.",
                "required_skills": ["React", "Node.js", "MongoDB", "REST APIs"],
                "experience_required": "2-4 years",
            },
            # Hard negatives
            {
                "job_id": "j_fe_hn1",
                "title": "Backend Python Developer",
                "company": "DataFlow",
                "description": "Build REST APIs with FastAPI and PostgreSQL. No frontend work.",
                "required_skills": ["Python", "FastAPI", "PostgreSQL"],
                "experience_required": "2+ years",
            },
            {
                "job_id": "j_fe_hn2",
                "title": "Embedded Systems Engineer",
                "company": "HardwareCo",
                "description": "Firmware development for IoT devices using C and Assembly.",
                "required_skills": ["C", "Assembly", "RTOS", "Electronics"],
                "experience_required": "2+ years",
            },
            {
                "job_id": "j_fe_hn3",
                "title": "ML Engineer",
                "company": "AIStartup",
                "description": "Train and deploy NLP models. PyTorch and model serving experience required.",
                "required_skills": ["Python", "PyTorch", "NLP", "MLOps"],
                "experience_required": "2+ years",
            },
            {
                "job_id": "j_fe_hn4",
                "title": "UI/UX Designer",
                "company": "CreativeAgency",
                "description": "Design user interfaces and conduct user research. Figma expert required.",
                "required_skills": ["Figma", "User Research", "Prototyping", "Design Systems"],
                "experience_required": "1-3 years",
            },
        ],
        "relevant_job_ids": ["j_fe_01", "j_fe_02"],
    },

    # ── Candidate 3: Java Backend / Architect ─────────────────────────────────
    {
        "candidate": {
            "candidate_id": "c003",
            "name": "Priya Nair",
            "skills": ["Java", "Spring Boot", "Microservices", "Kafka", "MySQL", "System Design"],
            "experience": "4 years backend engineer. Designed microservices for a core banking system "
                          "handling 10M+ transactions/day. Led architecture review sessions.",
            "education": "M.Tech Software Engineering, IIT Bombay",
            "preferred_roles": ["Backend Engineer", "Software Architect"],
        },
        "jobs": [
            {
                "job_id": "j_be_01",
                "title": "Java Backend Developer",
                "company": "FinServe",
                "description": "Build scalable microservices using Spring Boot and Kafka for financial "
                               "transaction processing. High-availability systems experience required.",
                "required_skills": ["Java", "Spring Boot", "Kafka", "MySQL"],
                "experience_required": "3-5 years",
            },
            {
                "job_id": "j_be_02",
                "title": "Software Architect",
                "company": "EnterpriseCore",
                "description": "Design system architecture for distributed, high-load systems. "
                               "Evaluate technology choices, define standards, mentor engineering teams.",
                "required_skills": ["System Design", "Microservices", "Cloud", "Java"],
                "experience_required": "5+ years",
            },
            # Hard negatives
            {
                "job_id": "j_be_hn1",
                "title": "Android Developer",
                "company": "MobileFirst",
                "description": "Develop Android apps using Kotlin and Jetpack Compose. Java knowledge helpful.",
                "required_skills": ["Kotlin", "Android SDK", "Jetpack Compose"],
                "experience_required": "2+ years",
            },
            {
                "job_id": "j_be_hn2",
                "title": "Data Engineer",
                "company": "BigDataCo",
                "description": "Build ETL pipelines with Spark and Hadoop. Python preferred.",
                "required_skills": ["Spark", "Hadoop", "Python", "SQL"],
                "experience_required": "2-4 years",
            },
            {
                "job_id": "j_be_hn3",
                "title": "Frontend React Developer",
                "company": "UIShop",
                "description": "Build responsive UIs with React and GraphQL.",
                "required_skills": ["React", "GraphQL", "CSS"],
                "experience_required": "2+ years",
            },
        ],
        "relevant_job_ids": ["j_be_01", "j_be_02"],
    },

    # ── Candidate 4: DevOps / SRE ─────────────────────────────────────────────
    {
        "candidate": {
            "candidate_id": "c004",
            "name": "Karthik Suresh",
            "skills": ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD", "Prometheus", "Ansible"],
            "experience": "3 years SRE at a cloud-native startup. Managed Kubernetes clusters for "
                          "100+ microservices. Reduced deployment time from 45 min to 8 min.",
            "education": "B.E. Information Technology, VTU",
            "preferred_roles": ["DevOps Engineer", "Site Reliability Engineer", "Cloud Engineer"],
        },
        "jobs": [
            {
                "job_id": "j_do_01",
                "title": "DevOps Engineer",
                "company": "CloudBase",
                "description": "Manage CI/CD pipelines, Kubernetes clusters, and AWS infrastructure. "
                               "Automate deployments using Terraform and Ansible.",
                "required_skills": ["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD"],
                "experience_required": "3+ years",
            },
            {
                "job_id": "j_do_02",
                "title": "Site Reliability Engineer",
                "company": "ScaleTech",
                "description": "Ensure reliability and uptime of production systems. On-call rotations, "
                               "incident response, SLO definition, and monitoring with Prometheus.",
                "required_skills": ["Kubernetes", "Prometheus", "Python", "Linux", "AWS"],
                "experience_required": "2-4 years",
            },
            {
                "job_id": "j_do_03",
                "title": "Cloud Infrastructure Engineer",
                "company": "FinCloud",
                "description": "Design and maintain multi-region AWS infrastructure for financial services. "
                               "IaC with Terraform. Strong security and compliance focus.",
                "required_skills": ["AWS", "Terraform", "Security", "Networking"],
                "experience_required": "3-5 years",
            },
            # Hard negatives
            {
                "job_id": "j_do_hn1",
                "title": "Backend Developer",
                "company": "AppCo",
                "description": "Build Node.js APIs. Docker knowledge a plus but not required.",
                "required_skills": ["Node.js", "MongoDB", "REST APIs"],
                "experience_required": "2+ years",
            },
            {
                "job_id": "j_do_hn2",
                "title": "Security Analyst",
                "company": "CyberShield",
                "description": "Conduct penetration testing, vulnerability assessments, and SIEM monitoring.",
                "required_skills": ["Penetration Testing", "SIEM", "Network Security", "CEH"],
                "experience_required": "2+ years",
            },
        ],
        "relevant_job_ids": ["j_do_01", "j_do_02", "j_do_03"],
    },

    # ── Candidate 5: Mobile Developer (Flutter / React Native) ───────────────
    {
        "candidate": {
            "candidate_id": "c005",
            "name": "Sneha Krishnamurthy",
            "skills": ["Flutter", "Dart", "React Native", "Firebase", "REST APIs", "iOS", "Android"],
            "experience": "2.5 years mobile developer. Shipped 4 apps on Play Store and App Store. "
                          "Handled offline-first architecture and push notifications.",
            "education": "B.Sc Computer Science, Christ University Bangalore",
            "preferred_roles": ["Mobile Developer", "Flutter Developer"],
        },
        "jobs": [
            {
                "job_id": "j_mob_01",
                "title": "Flutter Developer",
                "company": "HealthTech",
                "description": "Build cross-platform mobile apps using Flutter and Dart. "
                               "Integrate with Firebase and REST APIs. Ship features fast.",
                "required_skills": ["Flutter", "Dart", "Firebase", "REST APIs"],
                "experience_required": "1-3 years",
            },
            {
                "job_id": "j_mob_02",
                "title": "React Native Developer",
                "company": "FinMobile",
                "description": "Develop financial apps using React Native. iOS and Android deployment. "
                               "Experience with app store submission required.",
                "required_skills": ["React Native", "JavaScript", "iOS", "Android"],
                "experience_required": "2+ years",
            },
            # Hard negatives
            {
                "job_id": "j_mob_hn1",
                "title": "Frontend React Developer",
                "company": "WebCo",
                "description": "Build web UIs using React. No mobile experience needed.",
                "required_skills": ["React", "TypeScript", "CSS"],
                "experience_required": "2+ years",
            },
            {
                "job_id": "j_mob_hn2",
                "title": "Android Developer (Kotlin)",
                "company": "NativeApp",
                "description": "Native Android development with Kotlin and Jetpack. No Flutter.",
                "required_skills": ["Kotlin", "Android SDK", "Jetpack", "Room DB"],
                "experience_required": "2+ years",
            },
            {
                "job_id": "j_mob_hn3",
                "title": "Backend Engineer",
                "company": "ServerSide",
                "description": "Build scalable Node.js backends. Firebase experience a bonus.",
                "required_skills": ["Node.js", "PostgreSQL", "REST APIs"],
                "experience_required": "2+ years",
            },
        ],
        "relevant_job_ids": ["j_mob_01", "j_mob_02"],
    },

    # ── Candidate 6: Data Engineer ────────────────────────────────────────────
    {
        "candidate": {
            "candidate_id": "c006",
            "name": "Arjun Pillai",
            "skills": ["Apache Spark", "Airflow", "Python", "dbt", "Snowflake", "SQL", "Kafka"],
            "experience": "3 years data engineer. Built ETL pipelines processing 5TB/day. "
                          "Migrated legacy batch jobs to streaming with Kafka. Reduced pipeline cost by 40%.",
            "education": "M.Sc Data Engineering, BITS Pilani",
            "preferred_roles": ["Data Engineer", "Analytics Engineer"],
        },
        "jobs": [
            {
                "job_id": "j_de_01",
                "title": "Senior Data Engineer",
                "company": "DataPlatform Inc",
                "description": "Build and maintain large-scale data pipelines using Spark and Airflow. "
                               "Design Snowflake schemas and optimize query performance.",
                "required_skills": ["Spark", "Airflow", "Snowflake", "Python", "SQL"],
                "experience_required": "3-5 years",
            },
            {
                "job_id": "j_de_02",
                "title": "Analytics Engineer",
                "company": "MetricsCo",
                "description": "Own the data transformation layer using dbt and SQL. "
                               "Work with analysts and data scientists to model business data.",
                "required_skills": ["dbt", "SQL", "Snowflake", "Python"],
                "experience_required": "2-4 years",
            },
            # Hard negatives
            {
                "job_id": "j_de_hn1",
                "title": "Data Scientist",
                "company": "MLCo",
                "description": "Build ML models and run experiments. Pandas and Scikit-learn required.",
                "required_skills": ["Python", "Pandas", "Scikit-learn", "ML"],
                "experience_required": "2+ years",
            },
            {
                "job_id": "j_de_hn2",
                "title": "Backend Python Developer",
                "company": "APIStartup",
                "description": "Build REST APIs with FastAPI. Python and PostgreSQL required.",
                "required_skills": ["Python", "FastAPI", "PostgreSQL"],
                "experience_required": "2+ years",
            },
        ],
        "relevant_job_ids": ["j_de_01", "j_de_02"],
    },

    # ── Candidate 7: Cybersecurity ────────────────────────────────────────────
    {
        "candidate": {
            "candidate_id": "c007",
            "name": "Vikram Iyer",
            "skills": ["Penetration Testing", "Burp Suite", "Metasploit", "SIEM", "Python",
                       "Network Security", "OWASP", "CTF"],
            "experience": "2 years security analyst. Conducted 15+ penetration tests for fintech clients. "
                          "Found and reported 3 critical CVEs. CEH certified.",
            "education": "B.Tech IT, Anna University",
            "preferred_roles": ["Security Engineer", "Penetration Tester", "AppSec Engineer"],
        },
        "jobs": [
            {
                "job_id": "j_sec_01",
                "title": "Application Security Engineer",
                "company": "SecureBank",
                "description": "Perform code reviews, threat modeling, and penetration testing for web "
                               "and mobile applications. OWASP knowledge required.",
                "required_skills": ["Penetration Testing", "OWASP", "Burp Suite", "Python"],
                "experience_required": "2-4 years",
            },
            {
                "job_id": "j_sec_02",
                "title": "SOC Analyst",
                "company": "CyberShield",
                "description": "Monitor SIEM alerts, investigate incidents, triage vulnerabilities, "
                               "and write incident reports. 24/7 SOC environment.",
                "required_skills": ["SIEM", "Incident Response", "Network Security", "Linux"],
                "experience_required": "1-3 years",
            },
            # Hard negatives
            {
                "job_id": "j_sec_hn1",
                "title": "Backend Python Developer",
                "company": "WebCo",
                "description": "Build Django REST APIs. Python required. No security focus.",
                "required_skills": ["Python", "Django", "PostgreSQL"],
                "experience_required": "2+ years",
            },
            {
                "job_id": "j_sec_hn2",
                "title": "Network Engineer",
                "company": "TelecomCo",
                "description": "Configure and maintain routers, switches, and MPLS networks. CCNA required.",
                "required_skills": ["Cisco", "MPLS", "BGP", "CCNA", "Routing"],
                "experience_required": "2+ years",
            },
        ],
        "relevant_job_ids": ["j_sec_01", "j_sec_02"],
    },

    # ── Candidate 8: UI/UX Designer ───────────────────────────────────────────
    {
        "candidate": {
            "candidate_id": "c008",
            "name": "Meera Joshi",
            "skills": ["Figma", "User Research", "Prototyping", "Design Systems", "Usability Testing",
                       "Accessibility", "Sketch"],
            "experience": "3 years UX designer. Redesigned onboarding flow that improved activation "
                          "by 34%. Built a component design system adopted by 5 product teams.",
            "education": "B.Des Interaction Design, NID Ahmedabad",
            "preferred_roles": ["UX Designer", "Product Designer", "UI/UX Lead"],
        },
        "jobs": [
            {
                "job_id": "j_ux_01",
                "title": "Product Designer",
                "company": "GrowthApp",
                "description": "Own end-to-end design for new product features. Conduct user research, "
                               "create wireframes and prototypes in Figma, validate with usability tests.",
                "required_skills": ["Figma", "User Research", "Prototyping", "Design Systems"],
                "experience_required": "2-4 years",
            },
            {
                "job_id": "j_ux_02",
                "title": "UX Lead",
                "company": "EnterpriseUX",
                "description": "Lead UX strategy for B2B products. Define design standards, "
                               "run accessibility audits, mentor junior designers.",
                "required_skills": ["Figma", "Design Systems", "Accessibility", "User Research"],
                "experience_required": "3-5 years",
            },
            # Hard negatives
            {
                "job_id": "j_ux_hn1",
                "title": "Frontend Developer",
                "company": "WebAgency",
                "description": "Implement Figma designs in React. Pixel-perfect CSS required.",
                "required_skills": ["React", "CSS", "TypeScript"],
                "experience_required": "2+ years",
            },
            {
                "job_id": "j_ux_hn2",
                "title": "Graphic Designer",
                "company": "AdAgency",
                "description": "Create marketing materials, social media graphics, and brand assets "
                               "using Photoshop and Illustrator. No UX research involved.",
                "required_skills": ["Photoshop", "Illustrator", "Branding", "Typography"],
                "experience_required": "1-3 years",
            },
        ],
        "relevant_job_ids": ["j_ux_01", "j_ux_02"],
    },

    # ── Candidate 9: Embedded Systems ────────────────────────────────────────
    {
        "candidate": {
            "candidate_id": "c009",
            "name": "Rahul Varma",
            "skills": ["C", "C++", "RTOS", "ARM Cortex", "SPI", "I2C", "UART", "CAN Bus", "Python"],
            "experience": "3 years embedded software engineer. Developed firmware for automotive ECUs "
                          "and industrial IoT sensors. Experience with MISRA C compliance.",
            "education": "B.E. Electronics and Communication, PESIT Bangalore",
            "preferred_roles": ["Embedded Engineer", "Firmware Engineer", "IoT Developer"],
        },
        "jobs": [
            {
                "job_id": "j_emb_01",
                "title": "Embedded Software Engineer",
                "company": "AutoSystems",
                "description": "Develop firmware for automotive control units using C and RTOS. "
                               "CAN Bus and AUTOSAR experience preferred.",
                "required_skills": ["C", "RTOS", "CAN Bus", "ARM Cortex"],
                "experience_required": "2-4 years",
            },
            {
                "job_id": "j_emb_02",
                "title": "IoT Firmware Developer",
                "company": "SensorTech",
                "description": "Write low-level firmware for industrial IoT sensors. "
                               "SPI, I2C, UART protocols. Python for testing scripts.",
                "required_skills": ["C", "C++", "SPI", "I2C", "UART", "Python"],
                "experience_required": "2-3 years",
            },
            # Hard negatives
            {
                "job_id": "j_emb_hn1",
                "title": "Backend C++ Developer",
                "company": "TradingCo",
                "description": "High-frequency trading systems in C++. Linux, low-latency networking.",
                "required_skills": ["C++", "Linux", "Networking", "Low Latency"],
                "experience_required": "3+ years",
            },
            {
                "job_id": "j_emb_hn2",
                "title": "DevOps Engineer",
                "company": "CloudCo",
                "description": "Manage Kubernetes and CI/CD pipelines. Python scripting required.",
                "required_skills": ["Kubernetes", "Docker", "CI/CD", "Python"],
                "experience_required": "2+ years",
            },
        ],
        "relevant_job_ids": ["j_emb_01", "j_emb_02"],
    },

    # ── Candidate 10: Product Manager ─────────────────────────────────────────
    {
        "candidate": {
            "candidate_id": "c010",
            "name": "Divya Menon",
            "skills": ["Product Strategy", "Roadmapping", "User Research", "SQL", "A/B Testing",
                       "Stakeholder Management", "Agile", "JIRA"],
            "experience": "4 years product manager. Launched 3 products from 0 to 1. "
                          "Managed cross-functional teams of 15. Used data to drive all major decisions.",
            "education": "MBA, IIM Bangalore",
            "preferred_roles": ["Product Manager", "Senior PM", "Group PM"],
        },
        "jobs": [
            {
                "job_id": "j_pm_01",
                "title": "Senior Product Manager",
                "company": "GrowthCo",
                "description": "Own the product roadmap for our core platform. Define strategy, "
                               "run experiments, work with engineering and design to ship fast.",
                "required_skills": ["Product Strategy", "Roadmapping", "A/B Testing", "Agile"],
                "experience_required": "4-6 years",
            },
            {
                "job_id": "j_pm_02",
                "title": "Product Manager — Data",
                "company": "AnalyticsPlatform",
                "description": "PM for internal data products. SQL proficiency required. "
                               "Work with data engineers and analysts to build self-serve tools.",
                "required_skills": ["SQL", "Product Strategy", "Stakeholder Management", "Data"],
                "experience_required": "3-5 years",
            },
            # Hard negatives
            {
                "job_id": "j_pm_hn1",
                "title": "Business Analyst",
                "company": "ConsultingFirm",
                "description": "Document requirements, create process flows, and liaise with IT teams.",
                "required_skills": ["Requirements Gathering", "Process Mapping", "Excel", "SQL"],
                "experience_required": "2-4 years",
            },
            {
                "job_id": "j_pm_hn2",
                "title": "Scrum Master",
                "company": "AgileShop",
                "description": "Facilitate Agile ceremonies, remove blockers, coach teams on Scrum.",
                "required_skills": ["Scrum", "JIRA", "Agile Coaching", "Facilitation"],
                "experience_required": "2-4 years",
            },
            {
                "job_id": "j_pm_hn3",
                "title": "Marketing Manager",
                "company": "BrandCo",
                "description": "Run growth campaigns, manage social media, and track conversion funnels.",
                "required_skills": ["Marketing", "SEO", "Content Strategy", "Analytics"],
                "experience_required": "3-5 years",
            },
        ],
        "relevant_job_ids": ["j_pm_01", "j_pm_02"],
    },
]
