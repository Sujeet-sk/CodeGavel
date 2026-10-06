import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        String input = new String(System.in.readAllBytes()).trim();
        String[] data = input.split("\\s+");

        int target = Integer.parseInt(data[data.length - 1]);
        int[] nums = new int[data.length - 1];

        for (int i = 0; i < nums.length; i++) {
            nums[i] = Integer.parseInt(data[i]);
        }

        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    System.out.println(i + " " + j);
                    return;
                }
            }
        }
    }
}
