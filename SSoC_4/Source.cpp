#include "Thread.h"

int main(int argc, char *argv[])
{
	char key;
	int threadsCounter = 0;
	int currentPrinting = 1;
	MyThread* threads[10];
#ifdef __linux__
	initscr();
	clear();
	noecho();
	refresh();
	nodelay(stdscr, TRUE);
#endif

	while (1)
	{
#ifdef _WIN32
		key = getch_noblock();
		Sleep(1);
#elif __linux__
		key = getch();
		usleep(1000);
		fflush(stdout);
		refresh();
#endif
		switch (key)
		{
		case '+':
			if (threadsCounter < 10)
			{
				threadsCounter++;
				threads[threadsCounter - 1] = new MyThread(threadsCounter);
			}
			break;
		case '-':
			if (threadsCounter > 0)
			{
				threads[threadsCounter - 1]->closeThread();
				threadsCounter--;
			}
			break;
		case 'q':
			if (threadsCounter > 0)
			{
				for (int i = 0; i < threadsCounter; i++)
					threads[i]->closeThread();
			}
#ifdef __linux__
			clear();
			endwin();
#endif
			return 0;
		}

		if (threadsCounter && threads[currentPrinting - 1]->canPrint())
		{
			if (currentPrinting >= threadsCounter)
				currentPrinting = 1;
			else
				currentPrinting++;
			threads[currentPrinting - 1]->startPrint();
		}
#ifdef __linux__
		refresh();
#endif
	}
}