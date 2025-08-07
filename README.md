# journaling-app
Highly Available and Auto-Scaling Containerized Application Deployment [Containers Domain]



Project Announcement/Summary:

In this project, you will design and implement a highly available, auto-scaling containerized application using Amazon ECS with EC2 launch type. You'll deploy the application behind an Application Load Balancer with WAF protection, demonstrating how to achieve scalability, load balancing, and enhanced security for containerized workloads.


Problem Statement:

A customer has developed a containerized application but struggles with deploying it in a scalable, highly available manner. They need a solution that can automatically adjust to varying traffic loads, distribute requests efficiently, and provide protection against common web threats. The current setup lacks elasticity and resilience, leading to performance issues during traffic spikes and potential downtime.


Key Learning and Exploration Points:

Technical Deep Dives:

* Amazon ECS architecture and components
* EC2 launch type vs. Fargate
* Application Load Balancer features and configuration
* Auto Scaling for ECS services
* AWS WAF integration and rule sets

Development Focus:

* Setting up an ECS cluster with EC2 instances
* Deploying containerized applications on ECS
* Configuring Application Load Balancer and target groups
* Implementing auto-scaling based on CPU utilization
* Integrating WAF with ALB for enhanced security

Questions to Consider:

* How does ECS with EC2 launch type differ from using Fargate, and when would you choose one over the other?
* What are the best practices for designing task definitions and services in ECS?
* How can you optimize the auto-scaling configuration to balance responsiveness and cost?
* What WAF rules are most critical for protecting containerized web applications? How can you test if the WAF is working?
* How would you handle container health checks? 
* What monitoring and logging strategies would you implement for this architecture?


Success Metrics/Goals:

* Successfully deploy a containerized application across multiple EC2 instances in an ECS cluster
* Configure an Application Load Balancer to distribute traffic evenly across containers
* Implement auto-scaling that demonstrates both scale-out and scale-in based on CPU utilization
* Integrate WAF with ALB and configure at least three rule sets for common web threats
* Perform a load test to verify auto-scaling functionality and ALB distribution
* Create a CloudWatch dashboard showing key metrics for the ECS cluster, ALB, and WAF
* Document the entire setup process and create a presentation explaining the architecture, including security measures and potential optimizations

By completing this project, you will gain hands-on experience with container orchestration, load balancing, auto-scaling, and web application security. You'll develop skills in designing resilient and scalable architectures for containerized applications, which are crucial for modern cloud deployments and support roles.


General tips:

*  If you have exhausted your resources and you have a technical question, please refer to your mentor. Remember to do a full deep dive on your own using your resources before reaching out for help!
* If you would like to go above & beyond and ADD any component/service in addition to any of the above mentioned ones, feel free to do so. Get Creative!

