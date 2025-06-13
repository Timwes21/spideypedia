# AI Agent

                                      START
                                        |
                                        |
                                        |
                                  analyze_convo
                                        |
                                        |
                                        |
                                        |
                                  llm_call_router
                                     /   |  \
                                    /    |   \
                                   /     |    \
                                  /      |     \   
                                 /       |      \
                 comic_collection     trivia     unsure
                       |                |        /   
                       |                |       /    
                formulate_repsonse      |      /     
                                  \     |     /      
                                   \    |    /       
                                    \   |   /        
                                     \  |  /
                                      \ | /
                                       END

### START

User sends a message.

### analyze_convo

Gemini gets the most recent messages from the short term memory.

### llm_call_router

Gemini decides which route to take based on the current conversation.

### comic_collection

Updates the collection but seperating the users commands into seperate tasks, and the tasks or iterated through and handled accordingly.

### trivia

Answers the users question with the help of Geminis built in Google Search tool.

### unsure

Gemini decides an appropriat response based on the users unusual message.

### formulate_response

Based on the results given by the database during each task, a repsonse is formulated to keep the user in the loop.

### END

The Agents response is sent to the user.
