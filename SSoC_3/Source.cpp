#include "process.h"

using namespace std;

void Server(char* path, Artisan *artisan);
void Client(Artisan *artisan);

int main(int argc, char* argv[])
{
	Artisan *artisan = new Artisan();
#ifdef __linux__
	int pid = fork();
#endif
	switch (
#ifdef _WIN32
		argc
#endif
#ifdef __linux__
		pid
#endif
		)
	{
#ifdef _WIN32
	case 1:
#endif
#ifdef __linux__
	case 0:
#endif	
		Server(argv[0], artisan);		
		break;

	default:
		Client(artisan);
		break;
	}
}



void Server(char* path, Artisan *artisan)
{
#ifdef _WIN32
	HANDLE namedPipe = artisan->createMyPipe();

	HANDLE serverSemaphore = CreateSemaphore(NULL, 0, 1, TEXT("serverSemaphore"));
	HANDLE clientSemaphore = CreateSemaphore(NULL, 0, 1, TEXT("clientSemaphore"));

	artisan->createClientProcess(path);

	ConnectNamedPipe(namedPipe, NULL);

	WaitForSingleObject(serverSemaphore, INFINITE);

	char *buffer = NULL;
	buffer = (char *)malloc(sizeof(char) * 1024);

	printf("Server process\n");

	if (!WriteFile(namedPipe, "Ready", 1024, &(artisan->numToWrite), NULL))
		return;

	while (1)
	{
		ReleaseSemaphore(clientSemaphore, 1, NULL);
		WaitForSingleObject(serverSemaphore, INFINITE);

		if (ReadFile(namedPipe, buffer, 1024, &(artisan->numRead), NULL))
			printf("Client message: %s", buffer);

		if (!strcmp(buffer, "exit"))
		{
			CloseHandle(namedPipe);
			CloseHandle(serverSemaphore);
			free(buffer);
			return;
		}

		printf("\nInput message to client: ");
		fflush(stdin);
		gets_s(buffer, 1024);

		if (!WriteFile(namedPipe, buffer, 1024, &(artisan->numToWrite), NULL))
			break;

		ReleaseSemaphore(clientSemaphore, 1, NULL);

		if (!strcmp(buffer, "exit"))
		{
			CloseHandle(namedPipe);
			CloseHandle(serverSemaphore);

			free(buffer);
			return;
		}
	}
	return;
#endif
#ifdef __linux__
	void *buffer = shmat(artisan->shm_id, NULL, 0);
	cout << "Server process:\n";
	while (1) {
		char str[80];
		fflush(stdin);
		cout << "Message to client: ";
		fgets(str, 80, stdin);

		memcpy(buffer, str, 80);
		artisan->ReleaseSemaphore(artisan->sem_id, 0);

		artisan->WaitSemaphore(artisan->sem_id, 1);

		char messageFromClient[80];
		memcpy(messageFromClient, buffer, 80);

		cout << "Server process:\n";
		cout << "Message from client: ";

		for (int i = 0; messageFromClient[i] != '\0'; i++) {
			putchar(messageFromClient[i]);
			fflush(stdout);
			usleep(100000);
		}
	}
#endif
}

void Client(Artisan *artisan)
{
#ifdef _WIN32
	HANDLE serverSemaphore = OpenSemaphore(EVENT_ALL_ACCESS, FALSE, TEXT("serverSemaphore"));
	HANDLE clientSemaphore = OpenSemaphore(EVENT_ALL_ACCESS, FALSE, TEXT("clientSemaphore"));

	HANDLE namedPipe = artisan->createPipeFile();

	ReleaseSemaphore(serverSemaphore, 1, NULL);

	char *buffer = NULL;
	buffer = (char *)malloc(sizeof(char) * 1024);

	printf("Client process\n");

	while (1)
	{
		WaitForSingleObject(clientSemaphore, INFINITE);

		if (ReadFile(namedPipe, buffer, 1024, &(artisan->numRead), NULL))
		{
			if (!strcmp(buffer, "exit"))
			{
				CloseHandle(clientSemaphore);
				free(buffer);
				return;
			}

			printf("Server message: %s", buffer);

			char input[1024] = { '\0' };
			cout << "\nInput message to server: ";
			fflush(stdin);
			gets_s(input, 1024);

			if (!WriteFile(namedPipe, input, 1024, &(artisan->numToWrite), NULL))
				break;

			if (!strcmp(input, "exit"))
			{
				ReleaseSemaphore(serverSemaphore, 1, NULL);
				CloseHandle(clientSemaphore);
				free(buffer);
				return;
			}
		}
		ReleaseSemaphore(serverSemaphore, 1, NULL);
	}
	return;
#endif
#ifdef __linux__
	void *buffer = shmat(artisan->shm_id, NULL, 0);
	while (1)
	{
		char messageFromServer[80];

		artisan->WaitSemaphore(artisan->sem_id, 0);
		memcpy(messageFromServer, buffer, 80);

		cout << "\nClient process:\n";
		cout << "Message from server: ";

		for (int i = 0; messageFromServer[i] != '\0'; i++) {
			putchar(messageFromServer[i]);
			fflush(stdout);
			usleep(100000);
		}

		char messageForServer[80];

		fflush(stdin);
		cout << "Message to server: ";
		fgets(messageForServer, 80, stdin);

		memcpy(buffer, messageForServer, 80);

		cout << "\n";

		artisan->ReleaseSemaphore(artisan->sem_id, 1);
	}
#endif
}
