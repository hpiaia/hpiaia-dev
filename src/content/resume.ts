export const resume = {
  name: 'Humberto Piaia',
  role: 'Senior Full Stack Engineer',
  contacts: [
    { key: 'Email', text: 'betopiaia@gmail.com', href: 'mailto:betopiaia@gmail.com' },
    { key: 'Phone', text: '+55 55 99928-6765' },
    { key: 'LinkedIn', text: 'linkedin.com/in/hpiaia', href: 'https://linkedin.com/in/hpiaia' },
    { key: 'GitHub', text: 'github.com/hpiaia', href: 'https://github.com/hpiaia' },
    { key: 'Website', text: 'hpiaia.dev', href: 'https://hpiaia.dev' },
    { key: 'Location', text: 'Santa Catarina, Brazil' },
  ],
  about:
    'Full stack engineer with 10+ years of experience building and running web products end to end: product code in **TypeScript**, **PHP**, **Go** and **Rust**, and the infrastructure under it on **AWS** with **Terraform**, **Kubernetes** and **Docker**. Led several migrations from legacy stacks to modern ones with measurable gains, and kept clusters with hundreds of services healthy.',
  jobs: [
    {
      title: 'Senior Full Stack Engineer',
      companies: [
        { name: 'Constellation Network', url: 'https://constellationnetwork.io' },
        { name: 'Dor', url: 'https://www.getdor.com' },
      ],
      slug: 'constellation-network',
      from: '2024-04',
      to: 'now',
      bullets: [
        'Built the [cross-chain bridge](https://bridge.constellationnetwork.io/) that moves assets between Constellation and EVM chains, from the smart contract integration to the web app.',
        'Maintain and evolve the [Dor](https://www.getdor.com/) and [Dor Traffic Miner](https://constellationnetwork.io/dtm/) platforms, a network of foot-traffic sensors: new features, bug fixes and a steady rise in test coverage. Node, TypeScript, AWS Lambda, Kinesis, SQS, SNS.',
        'Manage the application infrastructure on AWS with Terraform and keep the CI/CD pipelines on CircleCI fast.',
      ],
    },
    {
      title: 'Senior Full Stack Engineer',
      companies: [{ name: 'Smartrr', url: 'https://smartrr.com' }],
      slug: 'smartrr',
      from: '2023-10',
      to: '2024-03',
      bullets: [
        'Moved backend background processing onto Temporal.io, replacing legacy cron jobs with durable, recurring workflows.',
        'Migrated the storefront from Gatsby to Next.js, cutting build times by **80%**.',
        'Raised test coverage and moved every suite from Jest to Vitest with SWC, making test runs **75%** faster.',
      ],
    },
    {
      title: 'Senior Full Stack Engineer',
      companies: [{ name: 'McGraw Hill', url: 'https://www.mheducation.com' }],
      slug: 'mcgraw-hill',
      from: '2021-08',
      to: '2023-10',
      bullets: [
        'Shipped features and refactors across education platforms serving a large student base.',
        'Built and maintained services with Angular, TypeScript, Go, AWS, Docker and Terraform.',
      ],
    },
    {
      title: 'Full Stack & DevOps Engineer',
      companies: [{ name: 'RankMyApp', url: 'https://rankmyapp.com' }],
      slug: 'rankmyapp',
      from: '2020-07',
      to: '2021-08',
      bullets: [
        'Designed and ran the communication architecture for **100+ dockerized microservices** on Kubernetes (AKS).',
        'Built the CI/CD pipelines on GitHub Actions and Azure.',
        'Set up cluster observability with Grafana, New Relic, Linkerd and Graylog.',
      ],
    },
    {
      title: 'Full Stack Developer & Tech Lead',
      companies: [{ name: 'Questor Sistemas', url: 'https://questor.com.br' }],
      slug: 'questor-sistemas',
      from: '2017-12',
      to: '2019-07',
      bullets: [
        'Built a web crawler from scratch with queue management handling **100,000+ jobs per day**, in PHP/Laravel with Redis and MongoDB, deployed serverless on AWS Lambda. Better scaling at lower cost.',
        'Led an internal C# / .NET Core framework following Domain-Driven Design and a multitier architecture, with a React + TypeScript design system on the front end.',
      ],
    },
    {
      title: 'Full Stack & Mobile Developer',
      companies: [{ name: 'iBR Soft', url: 'https://ibrsoft.com' }],
      slug: 'ibr-soft',
      from: '2016-06',
      to: '2017-12',
      bullets: [
        "Designed, built and maintained web and mobile apps with Laravel, React and React Native, integrated with the company's core product. Revenue per customer grew by up to **50%**.",
        'Introduced SOLID, Domain-Driven Design and unit testing across the codebase.',
      ],
    },
    {
      title: 'Full Stack Developer',
      companies: [{ name: 'Pixels' }],
      slug: 'pixels',
      from: '2014-01',
      to: '2016-06',
      bullets: [
        'Built original website layouts with Laravel and Vue.js, turning high-fidelity prototypes into working products together with designers.',
      ],
    },
  ],
  skills: [
    ['Programming', 'TypeScript, PHP, JavaScript, Go, Rust, C#'],
    ['Frontend', 'React, Next.js, Vue, Angular, React Native'],
    ['Backend', 'Node.js, Laravel, .NET Core, Temporal, PostgreSQL, Redis, MongoDB, Kafka'],
    ['Infrastructure', 'AWS, Terraform, Kubernetes, Docker, CI/CD'],
  ],
  languages: [
    ['English', 'Fluent'],
    ['Portuguese', 'Native'],
  ],
}
