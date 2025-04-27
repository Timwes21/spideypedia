from crewai import Agent, Task, Crew, Process



comic_researcher = Agent(
    role="Comic book expert",
    goal="get info based off of the comic book series name, issue number, and series volume",
    backstory = "You are the manager of the users comic collection, and to create a seamless experience for the user, you generate the comic info so they do not have to",
    verbose=False
    llm=
)

task_1 = Task(
    description="The user needs info about the comic amazing spiderman issu1 500 vol 1",
    agent=comic_researcher,
    expected_output='A well-researched and clear answer.'
)

crew = Crew(
    agents=[comic_researcher],
    verbose=1,
    tasks=[task_1],
    process=Process.sequential
)

result = crew.kickoff()
print(result)